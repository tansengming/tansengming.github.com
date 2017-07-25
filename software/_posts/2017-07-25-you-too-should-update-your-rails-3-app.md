---
layout: post
---

<a href='http://classicprogrammerpaintings.com/post/142737403879/programmers-at-work-maintaining-a-ruby-on-rails'>
  <img src='/images/rails3-intro.png' style='width: 400px' title='Classic Programmer Paintings: Programmers at work maintaining a Ruby on Rails application' />
</a>

We updated Evercondo to Rails 4 and we thought we’d celebrate by writing about it. We started the upgrade in teeny tiny bits more than 2 years ago and made a big push to finish it over summer. We mostly did it because they stopped doing security fixes for Rails 3 when Rails 5 was released mid 2016. But I like to tell new developers on the team that we did it so that they don’t have to look at Rails 3 ActiveRecord queries anymore.

We like the new shiny, soon to outdated Rails 4! Our only regrets were that we didn’t update sooner and that we didn’t do much about test coverage before this.

## Prelude
A little context: Evercondo is a pretty standard Rails monolith, serving both HTML to browsers and an API for our mobile app. We serve hundreds of communities and thousands of users every month. One of the main goals of the upgrade was to minimize downtime and make sure no users could tell the difference while it was happening.

/Work in Progress image TK/

The good news is that it all worked out pretty well. I count ~5 bugs that made it to users and 0 downtime for migrations in the 2+ years we were doing this. And a big reason is that the migration path was pretty well laid out. We were able to deploy upgrades to production in tiny chunks while still in Rails 3. Our migration basically went like this:

1. [while still in Rails 3] Update all the gems so they work with both Rails 3 and Rails 4
2. [while still in Rails 3] install the ‘strong-params’ gem
3. [while still in Rails 3] update your models and controllers to strong params
4. Start a Rails 4 branch
5. Update all the gems that only work on Rails 4
6. Fix all the ActiveRecord bugs
7. Merge and release the Rails 4 branch.

Automated Testing was absolutely essential to this migration. And while I consider it wonderful that we only released 5 bugs to the public I cannot help thinking that we could have made that better if we had more tests.
## Devise and Strong Parameters
Updating Devise and migrating all our models and controllers took up the bulk of our time. Updating Devise took months. And it was OK. We were would cautiously upgrade Devise to the next minor release, deploy it and wait to see if anything broke, then upgrade it to another minor release the next week. We took the same cautious approach to upgrading to Strong Parameters, doing it one major feature at a time so things won’t screw up all at the same time. This approach worked out pretty well for us since most of our bugs were Strong Params bugs. It really helped that we could do this while still on Rails 3 all the changes could be spread out.

## ActiveRecord Shenanigans
The next big thing we had to fix were all the changes that happened with ActiveRecord, like changes to the finder, the new integration with hstore, changes to how joins and reference were made etc. ActiveRecord also [broke the way we were using @wireframe’s Multitenant gem](https://github.com/wireframe/multitenant/pull/16). The scary thing about this was that we had to make all these changes a feature branch and had no easy way to run it on production in increments. The bulk of the final big bang release had to do with how we accessed data. We were pretty glad it turned out as well as it did.

## Conclusion
Most of the bugs that escaped were Strong Parameter bugs that would’ve been caught if we had more integration tests. So we’re definitely going to do more of that. The other big mistake was not paying attention to test coverage. Specifically not taking care to make sure that hairy parts of the codebase were tested. E.g. this was one of the bugs that escaped:

[image:EBEE5CC6-E6E7-42A2-A430-8C21D0D3D778-69106-000057F49DF23F97/Screen Shot 2017-07-25 at 12.32.13 pm.png]

Next time, we’ll try to make sure that any query that joins and merges and runs distinct gets tested just in case. 

last sentence TK

Right decision by incremental upgrades
