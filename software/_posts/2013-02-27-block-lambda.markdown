---
layout: post
---

Just a gentle reminder that this,

```ruby
def twice(greeting)
  greeting.call
  greeting.call
end

twice lambda{ puts 'Hello' }
```

this,

```ruby
def twice
  yield
  yield
end

twice { puts 'Hello' }
```

and this

```ruby
def twice(&blk)
  blk.call
  blk.call
end

twice { puts 'Hello' }
```

all do the same thing

_Inspired by [Avdi Grimm's Ruby Tapas](http://www.youtube.com/watch?v=Km9RlUfmvJc&list=WLE130C4CFCC3139DF)_