require 'rubygems'
require 'bundler/setup'
require 'pathname'

Root = Pathname.new(File.dirname(File.expand_path(__FILE__)))
require Root + '_lib/Page.rb'
require 'rake/clean'
CLEAN.add Root + '_site'

task :default => :test

task :deploy do
  sh 'git push origin master'
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