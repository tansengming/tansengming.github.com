---
layout: post
---  

Split testing, also called A/B testing, is a way of checking to see if changes to your web site gets you closer to your goals. When marketing asks you to set it up, it usually boils down to whether the change is going to make more money. Because these tests involve splitting your users into Control and Variation groups, I’ve found that they’re also great for doing staggered releases of new features on web applications.

![](/images/A-B_testing_example.png)
An example of a split test. [Image courtesy of the Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A-B_testing_example.png)

## Background
I started my engineering career at Intel that’s scarred me with deep feelings about bugs. Intel hates bugs because it’s a pain in the ass to fix hardware bugs in the wild. And while it doesn’t quite have the same sting working with web applications, I still take it personally whenever a bug makes it to users. There was the time I crashed the DB because I forgot to load test a new query. That time I screwed up an IE polyfill and broke every page on the site. Every fuck up gets an entry in my personal life ledger.

## Catch and Release
There are going to be bugs. I just want to catch the big ones before anyone else gets to sees them. I am the most irritating person in the office before a release because I:

* bug someone to do a code review
* bug the person next to me to try out the new feature
* bug the people who requested the feature to check it out,
* bug everyone who works for the people who requested the feature to give it a go,
* (sometimes) bug my team to see me do a demo of the new thing.

## The Big Day
But it’s not enough. Which is why I love the idea of staggered releases. Instead of releasing a new feature to everyone at the same time I can release it to a small group of people at the start and ramp it up as I get more confident. In case things go south I can shut it down and stop the bleed immediately. What I’ve discovered is that you don’t need a new tool to do this. It comes with most major split testing tools. For example this is what it looks like on Visual Web Optimizer (VWO):

![](/images/vwo_slider.png)

Being able to slide that down to 0% is one of the reasons I sleep better at night.

## The Set Up
Split testing tools usually try to get you test your page by having the changes on the same URL. I try to set it up as a split URL test when I am testing out new releases. I leave the original page untouched while the new feature gets a brand new URL.

![](/images/blob1426680630931.png)

Split URL testing. [Image courtesy of Visual Web Optimizer](https://vwo.com/knowledge/create-split-url-test/)

It’s harder to set up but I’ve found that it’s easier to do analytics this way. It’s a lot easier to pull up plain old web access logs for a particular URL than it is for an inline feature. And god help you if you need to figure out how many users tried out the new feature in Google Analytics without a separate URL.

## Data, my friend
Releasing a feature like this means that I end up with useful data in addition to having a better way to deploy. It’s nice to know that the weeks I spent updating the checkout page made a difference. It’s also nice when experiments don’t work and I have the numbers to prove that Marketing was wrong.

## Conclusion
It does take a tad more work to set up a feature this way but I think it’s worth it. You can deploy with confidence, prevent a potential disaster and get some data. Split Testing: now you don’t have to do it just because Marketing needs you to.

Fin

_Thank you Jason Owen and Kracekumar R for reviewing drafts of this post._

_Talk to me at [@sengming](https://twitter.com/sengming) ! I’d love to hear your war stories and bug minimization strategies._