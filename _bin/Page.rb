require 'json'
require 'open-uri'
class Page
  def self.all
    url = 'http://wiki.butnotsimpler.com/thinkspace/blog/published_json'
    JSON.parse(open(url).read).map{|p| new(p)}
  end
  
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
