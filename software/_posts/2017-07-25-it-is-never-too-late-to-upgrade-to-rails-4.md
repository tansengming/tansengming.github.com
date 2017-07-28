---
layout: post
---

<a href='http://classicprogrammerpaintings.com/post/142737403879/programmers-at-work-maintaining-a-ruby-on-rails'>
  <img src='/images/rails3-intro.png' alt='Classic Programmer Paintings: Programmers at work maintaining a Ruby on Rails application' class='img-rounded img-responsive' />
</a>

[Evercondo](http://app.evercondo.com) was upgraded to Rails 4 and we thought we would celebrate by writing about it. The upgrade started over 2 years ago and we ended up making a big push to finish it over the summer. We mostly did it because Rails 3 stopped receiving security updates. But I like to tell the new developers that we did it so that they don’t have to look at Rails 3 ActiveRecord queries anymore.

We like the new shiny! Deploys are a lot faster and it's good to know that we're keeping up with security updates. Our only regrets were that we didn't upgrade sooner and that we didn't pay attention to test coverage before.

## Some Background

Evercondo is a pretty standard Rails monolith, serving both HTML to browsers and an API to [a mobile app](https://itunes.apple.com/us/app/evercondo-smart-condo-living/id1121372160). We serve thousands of users every month and the plan was to make sure that none of them would notice the upgrade. I think it went well. We have caught around 5 bugs and have had no downtime for migrations in the 2+ years we were on it. A big reason we were able to do this was because we could deploy upgrades to production in tiny pieces while still on Rails 3. The migration basically went like this:

1. Update all the gems so they work with both Rails 3 and Rails 4 (while still on Rails 3)
2. Install the ‘strong-params’ gem (while still on Rails 3)
3. Update models and controllers to strong params (while still on Rails 3)
4. Start a Rails 4 feature branch and put it into Rails 4
5. Update all the gems that only work on Rails 4
6. Upgrade all the broken ActiveRecord queries.
7. Merge and release the Rails 4 branch.

Having a big set of automated tests were essential to this migration. And while it's great that we only released a few bugs I cannot help thinking that we could have done better if we had more tests.

## Devise and Strong Parameters

Updating Devise and migrating all our models and controllers took a lot of time. And that was OK. Since these could be done while we were still on Rails 3 we spread out the changes over a long time. We would

- cautiously upgrade Devise to the next minor release,
- test the shit out of it on staging,
- deploy it and wait to see if users found any bugs we missed,
- then upgrade it to the next minor release a week later

We took the same cautious approach to upgrading to Strong Parameters, doing it one major feature at a time. This incremental approach worked out pretty well for us since most of our bugs were caught in this phase. We got to deal with migration bugs spread over 2 years instead of scrambling to fix everything at the same time.

## ActiveRecord Shenanigans

ActiveRecord 4 came with a bunch of new features and changes. We had to update the finders, the new integration with hstore and change how joins and references were made. ActiveRecord also [broke the way we were using @wireframe’s Multitenant gem](https://github.com/wireframe/multitenant/pull/16). They ended up changing 8% of the codebase and we had no easy way to release it to production in increments. It was big bang or bust and we had our fingers on the revert button in case it all went to hell.


15 minutes after it went live a user broke the application by visiting a page that eluded 6 years of automated testing. The bug happened to be this fine query,

<img src='/images/rails3-conclusion.png' class='img-responsive' />

We did not collect test coverage data before and so it was never obvious that we missed this. Since then we've been leaning on Code Climate to gather coverage data and actually see what our tests are testing with the [their Chrome extension](https://codeclimate.com/browser-extension/).

## Finishing

There is no right way to do a major migration and we are glad that we chose to do it the slow, gentle way. It meant less stress and was flexible enough to work with a small team. Making the upgrade also forced us to clean up a lot cruft and helped improve the way we build software. We cannot wait to start with the next one.