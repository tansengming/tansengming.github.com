---
layout: post
---  

[Send With Us](https://www.sendwithus.com/) is one of those web services that you didn’t know you needed. Kinda like a cordless Dyson. The convenience of not having wires changed the way I cleaned. But even that doesn’t fully explain why I love it so much. While it is fairly routine to see web applications that rely on services for testing, monitoring and analytics, it is not obvious that you need Send With Us, which sits between your application and your email provider. Here is how it changed the way I build.

## Email Templating
Email designers have one of the worst jobs on the web. Creating email templates is kinda like web design, in Hell. A sadistic combination of incomplete implementations of undocumented specifications. Dear web developer, you do not want email templates in your code stuffing up your repository. Keep them far away enough so that it is someone else’s problem.

What’s worked for us at [Evercondo](http://www.evercondo.com/) is letting Send With Us deal with the templates. Our web application sends plain JSON to Send With Us while they handle all the designery parts. Designers can log in to Send With Us, design the shit out the email and we never have to change anything on the web app. It also helps that Send With Us comes with Litmus, which helps with designing emails on multiple devices and screen sizes. They also do version control in case we ever want to roll back a design.

![](/images/strange-1.jpg)

![](/images/strange-2.jpg)

## Email Debug
They keep a copy of every email we send which is so amazing that I don’t even know how I lived without it. Since they also store delivery times and read receipts I can form a pretty complete model of a customer’s experience. I know when an email was sent, when it was read and how it looked like on a customer’s device. It’s helped us fix design issues, debug problems with our sign up procedures, figure out whether we sent a mail to the correct email address etc.

![](/images/strange-3.jpg)

## Conclusion
It’s hard to nail down Send With Us with just a few words. I have not even mentioned big features like A/B testing and drip campaigns. Looking at it with a wider lens, Send With Us forced me to create a strict separation between email content and how the email looks like. If a web application is a fragile collection of business logic, you don’t want to risk breaking it because of an email design bug. Which is a fancy way of saying that Marketing can talk to Design instead of me when they want to update their email copy. Which makes me a happy person. Which is probably the best reason to use it.
