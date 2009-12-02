require 'json'
require 'open-uri'

task :get_pages do
  puts pages.count
  pages.each do |p|
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

def head
<<EOL
---
layout: post
---  
EOL
end

# helper functions
def pages
  url = 'http://wiki.butnotsimpler.com/thinkspace/blog/published_json'
  @pages ||= JSON.parse(open(url).read).map{|p| Page.new(p)}
end


class Page
  def initialize(hash)
    @struct = OpenStruct.new(hash)
  end
  
  def cleaned_content
    content.gsub(/^category:.*/, '')
  end

  def software_page?
    content[/category: .*(code|ruby|software)/]  
  end
  
  def story_page?
    !software_page?
  end
  
  def content
    @struct.content
  end
  
  def name
    @struct.name
  end
  
  def time
    Time.parse(@struct.time).strftime("%Y-%m-%d")
  end
  
  def filename
    page_dir + time + '-' +  dashed_name + '.markdown'
  end
  
  def page_dir
    if story_page?
      'stories/_posts/'
    elsif software_page?
      'software/_posts/'
    end    
  end
  
  def dashed_name
    name.gsub(' ', '-')
  end
end
