---
layout: post
---

I used to think that I did not have to worry about thread safety because of Ruby’s Global Interpreter Lock. Unfortunately [the GIL is there to protect the Interpreter, not to save me from my bugs](http://www.rubyinside.com/does-the-gil-make-your-ruby-code-thread-safe-6051.html). This post is based on a bug I found on production.

## The Setup

Let’s say that I need to send an SMS to everyone in a community and that I have to check for a communty’s available SMS credits before sending the message:

```ruby
community.users.each do |recipient|
  sms_credits = community.sms_credits

  if sms_credits > 0
    send_sms recipient, 'Everything is fine.'

    # take off a credit
    community.sms_credits = sms_credits - 1
    community.save
  end
end

def send_sms(recipient, message)
  # does a REST call to Twilio
  # which takes a while
end
```

## The Queue

Since `send_sms` is slow I can speed up the execution of the entire program with a queue. Queuing is a great way to separate the main program from the slow parts of the program.

{% include post-image.html url="/images/enqueue.png" description = "Fig 1: A Marxist take on software queues" %}

Each item on the queue is a job to send an SMS. Rich Uncle Pennybags (the main program) can chuck a job into a queue and immediately get back to doing what he was doing. At the same time separate worker processes can pick it up on the other side of the queue to send each SMS. Rails has a framework for this pattern called Active Jobs that can be used this way,

```ruby
commnunity.users.each do |recipient|
  # this chucks the job into a queue and returns immediately!
  # it no longer takes a while to finish.
  SmsSenderJob.perform_later recipient, community, 'Everything is fine.'
end

# Here's where you define the job that gets run by the workers
class SmsSenderJob < ApplicationJob
  def perform(recipient, community, message)
    sms_credits = community.sms_credits

    if sms_credits > 0
      send_sms recipient, message # this still takes a while.

      # take off a credit
      community.sms_credits = sms_credits - 1
      community.save
    end
  end
end
```

## The Bug

It was really easy to move all that code into the job but doing so caused a bug. To understand why, note that Active Job let’s you plug in different queue adapters and I used [Sidekiq](https://sidekiq.org/). Sidekiq is [fast](http://www.mikeperham.com/2015/11/16/sidekiq-4.0/), memory efficient and fantastic. However Sidekiq jobs have to be thread safe which they warn you about [all](https://github.com/mperham/sidekiq/wiki/Problems-and-Troubleshooting#threading), [the](https://github.com/mperham/sidekiq/wiki/FAQ#how-does-sidekiq-compare-to-resque-or-delayed_job), [time](https://github.com/mperham/sidekiq/wiki/Best-Practices#2-make-your-job-idempotent-and-transactional). The way the job was written above was a classic case of the [check-then-set race condition](http://stackoverflow.com/a/34550) which meant that it wasn’t thread safe.

Looking again at `SmsSenderJob`,


```ruby
class SmsSenderJob < ApplicationJob
  def perform(recipient, community, message)
    sms_credits = community.sms_credits

    if sms_credits > 0
      send_sms recipient, message # this still takes a while.

      # take off a credit
      community.sms_credits = sms_credits - 1
      community.save
    end
  end
end
```

Suppose the community started with 100 credits, had plenty of users and ran with more than one worker. The code might deduct multiple credits. Or it might deduct 1. There is no way of determining how many credits it was going to end up with because Ruby interleaves the code when multiple threads are used. My mistake was assuming that every line in a job would run in a block. This is how I thought it would run,

```ruby
# Job 1
sms_credits = community.sms_credits # start with 100 credits 
if sms_credits > 0
  send_sms recipient, message

  # take off a credit
  community.sms_credits = sms_credits - 1
  community.save # 99 credits
end
# Switch! -------------------------------------------------------------------
                      # Job 2
                      sms_credits = community.sms_credits # 99 credits
                      if sms_credits > 0
                        send_sms recipient, message

                        # take off a credit
                        community.sms_credits = sms_credits - 1
                        community.save # 98 credits
                      end
```

when it was just as likely to run this way,

```ruby
# Job 1
sms_credits = community.sms_credits # start with 100 credits
# Switch! -------------------------------------------------------------------
                      # Job 2
                      sms_credits = community.sms_credits # still 100 credits!!
                      if sms_credits > 0
                        send_sms recipient, message

                        # take off a credit
                        community.sms_credits = sms_credits - 1
                        community.save # 99 credits
                      end
# Switch! -------------------------------------------------------------------
# Back to Job 1
if sms_credits > 0
  send_sms recipient, message

  # take off a credit
  community.sms_credits = sms_credits - 1
  community.save # also 99 credits!
end
```

## The Easy Solution

The simple fix is to remove all shared mutable state from the multithreaded jobs. If there is nothing to check-and-set in a job then there is no way to have a check-and-set race condition. Like so,

```ruby
commnunity.users.each do |recipient|
  sms_credits = community.sms_credits

  if sms_credits > 0
    # this chucks the job into a queue and returns immediately!
    SmsSenderJob.perform_later recipient, 'Everything is fine.'

    # take off a credit
    community.sms_credits = sms_credits - 1
    community.save
  end
end

class SmsSenderJob < ApplicationJob
  def perform(recipient, message)
    send_sms(recipient, message)
  end
end
```

## The Hard Solution

But that only works if the main program is not running more than once at the same time. If I run the code on multiple processes, e.g. in multiple Unicorn instances on a web app, there might still be issues. Check-then-set race conditions don’t just happen with threads, they happen whenever there is shared mutable state, i.e. `community.sms_credits`. There’s less of a chance that it will happen at this level but it’s still worth fixing. The correct solution will probably involve some form of locking or journaling. Which would be fun to write about once it’s fixed.

## Conclusion

Coding for thread safety is hard. I hope this post helps you reason about the most common mistake when trying to write multithreaded programs.

_I would love you thank Moritz Neeb and Kamal Marhubi for reviewing earlier drafts of this._
