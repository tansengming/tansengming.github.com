require 'json'
require 'open-uri'

task :get_pages do
  puts pages.count
  pages.each do |p|
    File.open(filename_for(p), 'w') do |f|
      puts "Writing to #{filename_for(p)}..."
      f.puts head + p.content
    end
  end
end

def head
<<EOL
---
layout: post
---  
EOL
end

def filename_for(page)
  require 'ostruct'
  '_down/' + time_to_str(page.time) + '-' + page.name.gsub(' ', '-') + '.markdown'
end

def time_to_str(time)
  Time.parse(time).strftime("%Y-%m-%d")
end

def pages
  url = 'http://wiki.butnotsimpler.com/thinkspace/blog/published_json'
  @pages ||= JSON.parse(open(url).read).map{|p| OpenStruct.new(p)}
end

task :c do
  exec 'git commit -a'
end

task :build do
  exec 'jekyll'
end

task :up do
  exec 'jekyll --auto --server'
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
