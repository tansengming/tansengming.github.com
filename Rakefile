require 'rubygems'
require 'bundler/setup'
require 'rake/clean'
require 'open-uri'

Bundler.require(:default, :development)

ROOT = Pathname.new(File.dirname(File.expand_path(__FILE__)))
CLEAN.add (ROOT + '_site').to_s

task :default => :test

task :deploy do
  sh 'git push origin master'
end

desc 'crawls the site to catch broken links'
task :crawl do
  HOST    = 'http://0.0.0.0:4000'
  OPTIONS = {:discard_page_bodies => true, :verbose => true}

  begin
    open HOST
  rescue Errno::ECONNREFUSED
    sh 'bundle exec jekyll serve --detach'
  end

  Anemone.crawl(HOST, OPTIONS) do |anemone|
    anemone.on_every_page do |page|
      raise '404 Not Found!:' + page.url.path.to_s if page.not_found?
    end
    anemone.after_crawl do |pages|
      raise 'Error! Only found 1 page. Is the server down?' if pages.size == 1
    end
  end
  puts ">> Looks good you have no broken links! <<"
end

task :build do
  sh 'bundle exec jekyll build'
end

task test: [:crawl]