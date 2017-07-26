---
layout: post
---

<a href='http://classicprogrammerpaintings.com/post/142737403879/programmers-at-work-maintaining-a-ruby-on-rails'>
  <img src='/images/rails3-intro.png' alt='Classic Programmer Paintings: Programmers at work maintaining a Ruby on Rails application' class='img-rounded img-responsive' />
</a>

[Evercondo](http://app.evercondo.com) was upgraded to Rails 4 and we thought we would celebrate by writing about it. The upgrade started over 2 years ago and we ended up making a big push to finish it over the summer. We mostly did it because Rails 3 stopped receiving security updates. But I like to tell the new developers that we did it so that they don’t have to look at Rails 3 ActiveRecord queries anymore.

We like the new shiny! Deploys are faster and it's good to know that we are not using outdated software. Our only regrets were that we didn't upgrade sooner and that we didn’t do much about test coverage before this.

## Context

Evercondo is a pretty standard Rails monolith, serving both HTML to browsers and an API to [a mobile app](https://itunes.apple.com/us/app/evercondo-smart-condo-living/id1121372160). We serve hundreds of communities and thousands of users every month. One of the main goals of the upgrade was to minimize downtime and make sure no users could tell the difference while it was happening.

The good news is that it all worked out well. I count ~5 bugs that made it to users and no downtime for migrations in the 2+ years we were on it. A big reason we were able to do this was because we could deploy upgrades to production in tiny pieces while we were still on Rails 3. The migration basically went like this:

1. Update all the gems so they work with both Rails 3 and Rails 4 (while still on Rails 3)
2. Install the ‘strong-params’ gem (while still on Rails 3)
3. Update models and controllers to strong params (while still on Rails 3)
4. Start a Rails 4 feature branch and put it into Rails 4
5. Update all the gems that only work on Rails 4
6. Upgrade all the broken ActiveRecord queries.
7. Merge and release the Rails 4 branch.

Having a big set of automated tests were essential to this migration. And while it's great that we only released a few bugs I cannot help thinking that we could have done better if we had more tests.

## Devise and Strong Parameters

Updating Devise and migrating all our models and controllers took a lot of time. And that was OK. We would 

- cautiously upgrade Devise to the next minor release, 
- deploy it and wait to see if anything broke, 
- then upgrade it to another minor release the next week

We took the same cautious approach to upgrading to Strong Parameters, doing it one major feature at a time so things don't screw up at the same time. This approach worked out pretty well for us since most of our bugs were Strong Parameters bugs. It really helped that we could do this while still on Rails 3 so all the changes could be spread out.

## ActiveRecord Shenanigans

The next big thing we had to fix were all the changes that happened with ActiveRecord, like changes to the finder, the new integration with hstore, changes to how joins and reference were made etc. ActiveRecord also [broke the way we were using @wireframe’s Multitenant gem](https://github.com/wireframe/multitenant/pull/16). The scary thing about this was that we had to make all these changes on a feature branch and had no easy way to run it on production in increments. It was big bang or bust with the way we accessed data. We were pretty lucky that it turned out as well as it did.

## Conclusion

Most of the bugs that escaped were Strong Parameter bugs that would’ve been caught if we had more integration tests. So we’re definitely going to do more of that. The other big mistake was not paying attention to test coverage. Specifically not taking care to make sure that hairy parts of the codebase were tested. E.g. this was one of the bugs that escaped:

<img src='/images/rails3-conclusion.png' class='img-responsive' />

Next time, we’ll try to make sure that any query that joins and merges and runs distinct gets tested just in case. 

last sentence TK

Right decision to do it by incremental upgrades. 

- incremental upgrade
- lots of tests
