---
layout: post
# image: /images/forth-1.jpeg
description: I recently learned how to Curry in Ruby and turns out it’s pretty easy to do.
---

I recently learned how to Curry in Ruby and turns out it’s pretty easy to do. Here is an example to illustrate.

To start with here’s how you can create a function in Ruby,

```ruby
greet = lambda {|name| "Hello #{name}" }
greet.call('World')
# => "Hello World"
```

You can create a function with multiple arguments too,

```ruby
generic_greet = lambda {|greeting, name| "#{greeting} #{name}" }
generic_greet.call('Hi', 'SengMing')
# => "Hi SengMing"
```

This is where the magic happens. Currying translates a function so that it is called twice with a single argument instead,

```ruby
curried_generic_greet = generic_greet.curry
curried_generic_greet.call('Ahoy').call('SengMing')
# => "Ahoy SengMing"
```

This is useful for creating pre-configured functions, e.g. calling hi_greet with a name will output a greeting with a “Hi”

```ruby
hi_greet = curried_generic_greet.call('Hi')
hi_greet.call('SengMing')
# => "Hi SengMing"
```

While hello_greet would do the same with “Hello”

```ruby
hello_greet = curried_generic_greet.call('Hello')
hello_greet.call('SengMing')
# => "Hello SengMing"
```

It is great to see how easy it is to do in Ruby. Yet I don’t think it will affect the way I code since I still prefer methods over functions. Please let me know if you have curried in Ruby, I’d love to hear your thoughts!

PS: this post was insprired from reading [Benjamin Tan’s Mastering Ruby Closures](https://pragprog.com/book/btrubyclo/mastering-ruby-closures), which I highly recommend.

PPS: [Here’s an explanation](https://medium.com/@sengming/designing-my-name-8b2da47bb827) of why my name is strangely formatted.