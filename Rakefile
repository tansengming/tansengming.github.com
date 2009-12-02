require '_bin/Page.rb'
require 'rake/clean'
CLEAN.add '_site'

task :default => :test

task :make_rss do
  require 'rss/maker'

  version = "2.0" # ["0.9", "1.0", "2.0"]
  destination = "test_maker.xml" # local file to write

  content = RSS::Maker.make(version) do |m|
  m.channel.title = "Example Ruby RSS feed"
  m.channel.link = "http://www.rubyrss.com"
  m.channel.description = "Old news (or new olds) at Ruby RSS"
  m.items.do_sort = true # sort items by date
    
  i = m.items.new_item
  i.title = "Ruby can parse RSS feeds"
  i.link = "http://www.rubyrss.com/"
  i.date = Time.parse("2007/2/11 14:01")

  i = m.items.new_item
  i.title = "Ruby can create RSS feeds"
  i.link = "http://www.rubyrss.com/"
  i.date = Time.now
  end

  File.open(destination,"w") do |f|
  f.write(content)
  end
end

task :get_pages do
  puts 'Total ' + Page.all.count.to_s + ' pages'
  Page.all.each do |p|
    File.open(p.filename, 'w') do |f|
      puts "Writing to #{p.filename}..."
      f.puts head + p.cleaned_content
    end
  end
end

task :c do
  exec 'git commit -a'
end

task :build => :get_pages do
  exec 'jekyll'
end

task :up => :get_pages  do
  exec 'jekyll --auto --lsi --server'
end

task :crawl do
  require 'anemone'
  root = 'http://localhost:4000'
  options = {:discard_page_bodies => true, :verbose => true}
 
  Anemone.crawl(root, options) do |anemone|      
    anemone.on_every_page do |page|      
      raise '404 Not Found!:' + page.url.path.to_s if page.not_found?
    end
    anemone.after_crawl do |pages|      
      raise 'Error! Only found 1 page. Is the server down?' if pages.size == 1
    end
  end
end
task :test => :crawl

def head
<<EOL
---
layout: post
---  
EOL
end
