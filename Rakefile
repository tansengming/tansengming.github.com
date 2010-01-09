require '_bin/Page.rb'
require 'rake/clean'
CLEAN.add '_site'

task :default => :test

task :deploy => :build do
  sh 'rsync -avzr _site/ butnotsi@butnotsimpler.com:www/hello/'
  sh 'ssh butnotsi@butnotsimpler.com "chmod a+r /home/butnotsi/www/hello/images/profile_small.jpg"'
  sh 'git push github master'
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

task :build do
  sh 'jekyll'
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

def head
<<EOL
---
layout: post
---  
EOL
end
