---
layout: post
---

I have mistakenly believed that I did not have to worry about thread safety because of Regular Ruby’s Global Interpreter Lock. Unfortunately [the GIL is there to protect the Interpreter, not to save me from my dumb ass code](http://www.rubyinside.com/does-the-gil-make-your-ruby-code-thread-safe-6051.html). This post is based on a true story.

## The Setup

Let’s say I needed to send an SMS to everyone in a community. Let’s say every community has prepaid credits and I had to check for credits before sending their SMS. I could start with this,

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

Since I know that `def send_sms` is slow, I was willing to complicate things a bit to make it a lot faster. A queue is a great way to split up the main program and the slow parts of the program.

<img src='/images/enqueue.png' class='img-responsive img-rounded' />

Each item on the queue is a job to send an SMS. Rich Uncle Pennybags (the main program) can chuck a job into a queue and immediately get back to doing what he was doing. At the same time separate worker processes can pick it up on the other side of the queue to send each SMS. The pattern is common enough that Rails has a framework for it called Active Jobs,

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

Notice how easy it was to move all that code into the job. There is a bug and the bug is in the details. Active Job let’s you plug in alternative job implementations and my favorite one is called Sidekiq. Sidekiq is fantastic, it’s fast ([and gets faster](http://www.mikeperham.com/2015/11/16/sidekiq-4.0/)), it’s memory efficient, I love it. The only catch is that Sidekiq jobs have to be thread safe. Which Sidekiq Mike warns you about [all](https://github.com/mperham/sidekiq/wiki/Problems-and-Troubleshooting#threading), [the](https://github.com/mperham/sidekiq/wiki/FAQ#how-does-sidekiq-compare-to-resque-or-delayed_job), [time](https://github.com/mperham/sidekiq/wiki/Best-Practices#2-make-your-job-idempotent-and-transactional). Despite that I did not catch the bug until it cost [us](http://evercondo.com/) a little money. You see the code above isn’t thread safe. It is a classic case of the [check-then-set race condition](http://stackoverflow.com/a/34550).

In other words, the job code you saw as above (and so below) is terrible code that you should never run multithreadedly,

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

Suppose the community started with 100 credits, plenty of users and I ran the jobs with Sidekiq’s default 25 workers. The code might deduct multiple credits. Or it might deduct 1. There is no way of determining how many credits I was going to end up with because Ruby interleaves the code when multiple threads are involved. The trouble was assuming that all the lines in a job would get run in a block. This is how I thought it would run,

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

when really it was just as likely to run like this,

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

But that only works if I can guarantee that the main program never gets run more than once at the same time. If I had to run the same code on multiple processes, e.g. in multiple Unicorn instances on a web app, I would still be screwed. Check-then-set race conditions don’t just happen with threads, it happens whenever there is shared mutable state (`community.sms_credits` ). All I’ve done is move the problem to another level. Sure there’s less of a chance that it’ll happen at this level but it’s still enough of a chance that it’s worth fixing. One day.  The correct solution will probably involve some form of locking or journaling. Which would be fun to write about once I’ve fixed it.

## Conclusion

All I wanted to do was make things a run little faster and didn’t realize that I had dropped into a pit filled with ten dollar words like Concurrency and Thread Safety. Do I regret anything? No! Will I screw this up again later? Maybe!

Fin.

_I would love you thank Moritz Neeb and Kamal Marhubi for reviewing earlier drafts of this._
