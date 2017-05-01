---
layout: post
---

I am trying to get back into Elixir after trying it on a while back ago and keep tripping up on the tiniest things. Here’s a list so I’ll remember the next time I do another refresher,

## Strings are really a sequence of bytes until they aren’t
I keep fucking this up so it goes on top. In Elixir, `'A bunch of bytes'` is not the same as `"A bunch of bytes"`. Single quoting gets you a char list while double quoting returns a string. It’s probably safe to ignore single quotes because [char lists are mostly used to interface with Erlang](http://elixir-lang.org/getting-started/binaries-strings-and-char-lists.html). The worse thing about screwing this up is that it gets you the most useless errors:

```elixir
iex> URI.encode "this is a string"
"this%20is%20a%20string"
iex> URI.encode 'not a string'
** (FunctionClauseError) no function clause matching in URI.encode/2
    (elixir) lib/uri.ex:273: URI.encode('Sydney', #Function<1.59727112/1 in URI.encode/1>)
```

## Non Objects
Elixir has no objects. Which means that there aren’t dot chains. But they make it up with pipes and having the first parameter of a method from the pipe. Which means that,

`String.upcase(Enum.join(["a", "b", "c"], ", "))`

is the same as,

`["a", "b", "c"] |> Enum.join(", ") |> String.upcase`

## Functions with no name
These are different enough from Ruby that it needs repeating,

```elixir
sum = fn (a, b) -> a + b end
# is the same as
sum = &(&1 + &2)
# and are both called with
sum.(2, 3)
```

a slightly more advanced example,

```elixir
a = [1, 2, 3]
a |> Enum.map(fn x -> x*x end) # [1, 4, 9]
a |> Enum.map(&(&1 * &1)) # [1, 4, 9]
```

I’m sticking with `fn` until I get the hang of things.

## Inserts and Updates
There’s a really nifty way to do insert a new item at the head of a list,

```elixir
results = [1, 2]
[0 | results] # [0, 1, 2]
# does not work the other way!
[results | 0] # [[1, 2] | 0]
```

There’s a similar thing with Map updates,

```elixir
map = %{a: 1, b: 2}
%{map | a: 100} # %{a: 100, b: 2}
# however, this doesn't work
%{a: 100 | map} # error!
# and neither does inserts
%{map | c: 100} # error!
```

That’s it for now. I’m not getting into Pattern Matching because that’s a whole other beautiful beast. If you need to do a refresher, [Elixir School](https://elixirschool.com) is pretty neat.

*Thank you Brian Glusman for reviewing drafts of this post.*