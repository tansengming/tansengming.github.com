---
layout: post
---  

Just a gentle reminder that this,

```
def twice(greeting)
  greeting.call
  greeting.call
end

twice lambda{ puts 'Hello' }
```

this,

```
def twice
  yield
  yield
end

twice do { puts 'Hello' }
```

and this

```
def twice(&blk)
  blk.call
  blk.call
end

twice do { puts 'Hello' }
```

all do the same thing

_Referenced from [Avdi Grimm's Ruby Tapas](www.youtube.com/watch?v=Km9RlUfmvJc&list=WLE130C4CFCC3139DF)_