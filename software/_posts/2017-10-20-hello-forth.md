---
layout: post
---

<p class='text-center'>
  <img src='/images/forth-1.jpeg' alt='Negative Megalith #5 by Michael Heizer' class='img-rounded img-responsive' />
  <a  href='https://www.flickr.com/photos/grufnik/1410520839/'>
    <small><u>Negative Megalith #5 (Michael Heizer) Photo by Grufnik</u></small>
  </a>
  <a  href='https://creativecommons.org/licenses/by-nc-nd/2.0/'>
    <small><u>(CC BY-NC-ND 2.0)</u></small>
  </a>
</p>

I’ve been doing a little Forth, a tiny and delightful stack based language. It’s a different way to think about programming and surprisingly easy to get into. It’s been fun to learn and I’d love to show you how easy it is to get started.

Here’s a function (called a Word) named `fizz?` which takes a Number off the top of a Stack and prints “Fizz” if it’s a multiple of 3,

<img src='/images/forth-2.png' class='img-responsive img-rounded' />

It looks a bit funky and the thing to know is that there are only Words and Numbers, and that Words use the top items of the Stack. For example, if you type 1 2 3 the stack will look like this,

```
3 <- Top of the stack
2
1
```

Here’s the same stack if you tip it over to the right side, see?

```
TYPE : 1 2 3
STACK: 1 2 3 <- Top of the stack
```

`swap` will reverse the top 2 items of the stack, so you’ll end up with,

```
TYPE : 1 2 3 swap
STACK: 1 3 2 <- Top
```

`drop` removes to top item on the stack so,

```
TYPE : 1 2 3 swap drop
STACK: 1 3 <- Top
```

`.` prints the top of the stack while `."` prints everything before the next `"` so that,

```
TYPE  : 1 2 3 swap drop . .” 4!”
STACK : 1 <- Top ( 3 is consumed by the . )
OUTPUT: 3 4! ok
```

Here’s the Word we started out with,

<img src='/images/forth-2.png' class='img-responsive img-rounded' />

If the top of the stack is 3, `fizz?` would go like this:

- duplicates 3 and puts that to the top of the stack
- run 3 modulo 3 on it, replacing 3 with 0 at the top of the stack
- compares 0 to 0 and because it is equal, replaces 0 with true (-1) on top
- Goes on the true path of the if, which prints “Fizz” then leaves -1 to the top of the stack

Extending this to a full implementation of FizzBuzz would look like this,

```forth
: fizz? ( n -- n b ) dup 3 mod 0 = if ." Fizz " -1 else 0 then ;
: buzz? ( n -- n b ) dup 5 mod 0 = if ." Buzz " -1 else 0 then ;
: fizz-or-buzz? ( n -- n b ) dup fizz? swap buzz? swap drop or ;
: fizz-buzz-loop ( n -- ) cr 0 do i fizz-or-buzz? if else . then cr loop ;
16 fizz-buzz-loop ( runs the fizz-buzz-loop from 0 to 15 )
```

Those 5 lines contain IO, branching, looping, function definitions and stack manipulation and covers most of the language. I recommend going through [Easy Forth](https://skilldrick.github.io/easyforth/) to learn the rest of it.

I love Forth but it is a different way to think about memory and flow control. And that’s hard. The FizzBuzz took me hours to write but it made me wonder if it might be easier to write a Forth compiler. Which I think is an interesting thought for any programming language. Stay tuned for the next post. May the Forth be with you.

_Thanks to [Saul Pwanson](http://saul.pw/) for running the Forth workshop at the [Recurse Center](https://www.recurse.com/scout/click?t=ba1ec650f5064a591044b4380733aa8c). You could say that I was Forthunate to be there._
