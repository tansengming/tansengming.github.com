$(document).ready(function() {
  $('dd').each(function(index) { $(this).html(index + 1); });
});

$(document).ready(function() {
  $('.lightbox a').lightBox();
});