---
layout: page
permalink: /portfolio/index.html
---
<h3>MakanPages (2011)</h3>
<div class='photos'>
  <div class="photo"> 
  	<a href="/images/makanpages-index.png" title="Landing page for MakanPages.com">
  		<img src="/images/makanpages-index-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
  	</a> 
  </div> 
  <div class="photo"> 
    <a href="/images/makanpages-food.png" title="Food Index for MakanPages.com">
      <img src="/images/makanpages-food-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a> 
  </div>
  <div class="photo"> 
    <a href="/images/makanpages-place.png" title="Eating Place Details on MakanPages.com">
      <img src="/images/makanpages-place-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a>
  </div>
</div>
<div class='clear'>
</div>

The project involved analyzing hundreds of food blogs to figure out where people liked to eat. The main challenge was building the text mining engine from scratch because existing libraries didn't work out. Classification was also harder than expected. The final site is generated as a static site with a Rails and MongoDB backend.
[Link &raquo;](http://makanpages.com/)

<br />

<h3>Semantic Widgets for The Star Online (2010)</h3>
<div class='photos'>
  <div class="photo"> 
  	<a href="/images/bizstar-main.png" title="The Star Business Main Page">
  		<img src="/images/bizstar-main-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
  	</a> 
  </div> 
  <div class="photo"> 
    <a href="/images/bizstar-article.png" title="The Star Business Article page">
      <img src="/images/bizstar-article-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a> 
  </div>
  <div class="photo"> 
    <a href="/images/bizstar-marketwatch.png" title="The Star Business Marketwatch page">
      <img src="/images/bizstar-marketwatch-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a>
  </div>
</div>
<div class='clear'>
</div>

While at Knorex, we built a stock watcher, article discovery tool and other data based widgets for Malaysia's largest English newspaper. The main challenge was to support the millions of hits we expected to get every month. We leaned heavily on Varnish and HTTP load testing to make sure things worked on that scale. Built with jQuery on a REST backend made out of Glassfish and MySQL.
[Link &raquo;](http://biz.thestar.com.my/)

<br />

<h3>Manufacturing Yield and Machine Analysis (2009)</h3>

<div class='photos'>
  <div class="photo"> 
  	<a href="/images/versailles-summary.png" title="Yield summary for different products">
  		<img src="/images/versailles-summary-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
  	</a> 
  </div> 
  <div class="photo"> 
    <a href="/images/versailles-overview.png" title="Yield Overview sorted by time and lots">
      <img src="/images/versailles-overview-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a> 
  </div>
  <div class="photo"> 
    <a href="/images/versailles-wafer.png" title="Yield summary lumped as wafers">
      <img src="/images/versailles-wafer-thumb.png" alt="makan pages index" style='width: 200px; height: 150px' /> 
    </a>
  </div>
</div>
<div class='clear'>
</div>

While at Freescale Semiconductors, I built an application to report and analyze millions of micro-controller test results per month. It also analyzed lot equipment history to detect equipment failures using statistical tests. The main challenge was working with the myriad of data sources and optimizing the analysis to handle the data load. Built on Rails on a MySQL backend. Relied on R for statistical work.

<script type="text/javascript" charset="utf-8"> 
	$(document).ready(function() {
  	$('.photos a').lightBox();
	});
</script>