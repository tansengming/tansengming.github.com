$(document).ready(function() {
  $('dd').each(function(index) { $(this).html(index + 1); });
});

$(document).ready(function() {
  $('.lightbox a').lightBox();
});

$(document).ready(function() {
  prettyPrint();
});

// <!-- asynchronous google analytics: mathiasbynens.be/notes/async-analytics-snippet
// change the UA-XXXXX-X to be your site's ID -->
var _gaq = [['_setAccount', 'UA-2279020-6'], ['_trackPageview']];
(function(d, t) {
var g = d.createElement(t),
    s = d.getElementsByTagName(t)[0];
g.async = true;
g.src = ('https:' == location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
s.parentNode.insertBefore(g, s);
})(document, 'script');

// disqus
(function() {
  var links = document.getElementsByTagName('a');
  var query = '?';
  for(var i = 0; i < links.length; i++) {
  if(links[i].href.indexOf('#disqus_thread') >= 0) {
    query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
  }
  }
  document.write('<script charset="utf-8" type="text/javascript" src="http://disqus.com/forums/simplest/get_num_replies.js' + query + '"></' + 'script>');
})();