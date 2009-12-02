---
layout: post
---  
<script src="http://gist.github.com/203858.js"></script>

This is probably obvious to old school Unix hackers but won't make ANY SENSE AT ALL until I realized that:

 1. When `fork` gets called without a block it spawns off a child process.
 1. Which means that the `if` statement will get run twice, once on the parent process and the other on the child process.
 1. `if fork` evaluates to true in the parent process since `fork` returns the process ID of the child procecess.
 1. In the child process `if fork` goes through the `else` statement instead because `fork` always returns `nil` in a child process.
 1. The child process will be left hanging in a zombie state untill `Process.wait` gets called in the parent process.
 1. You can't write to a pipe until you close the read port and you can't read from a pipe until you close the write port.

