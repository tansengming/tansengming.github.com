---
layout: post
---

If you intend to add widgets to your site, do note that they don't usually come as asynchronous Javascript. Meaning that they will screw up your page load times. For example, before switching to the async versions of the Facebook and Get Satisfaction widgets every page took an extra 3 seconds to load. I use [yepnope.js](http://yepnopejs.com/) whenever I can but not all widgets (e.g. Facebook) work well with it.

Here is a list of asynced versions of widgets I've been using:

### Google Analytics

```javascript
var _gaq=[['_setAccount','YOUR_ID_HERE'],['_trackPageview']];
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
```

### Facebook

```javascript
<div id='fb-root'></div>
window.fbAsyncInit = function() {
  FB.init({appId: 'YOUR_APP_ID_HERE', status: true, cookie: true, xfbml: true});
};
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
```

### Get Satisfaction

```javascript
<div id='gs-widget'></div>
yepnope([{
  load: document.location.protocol + '//s3.amazonaws.com/getsatisfaction.com/javascripts/feedback-v2.js',
  complete: function () {
    var feedback_widget_options = {};
    feedback_widget_options.display = "overlay";
    feedback_widget_options.company = "YOUR_ID_HERE";
    feedback_widget_options.placement = "left";
    feedback_widget_options.color = "#222";
    feedback_widget_options.style = "idea";
    feedback_widget_options.container = "gs-widget"; // This bit is important
    var feedback_widget = new GSFN.feedback_widget(feedback_widget_options);
  }
}]);
```

### Share This

```javascript
var switchTo5x=false;
yepnope([{
  load: document.location.protocol + '//w.sharethis.com/button/buttons.js',
  complete: function () {
    stLight.options({publisher:'YOUR_ID_HERE'});
  }
}]);
```
