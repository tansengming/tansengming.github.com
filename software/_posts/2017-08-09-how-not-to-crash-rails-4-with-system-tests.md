---
layout: post
image: /images/how-not-1.jpg
description: Details about how to avoid test failures when running Rails specific tests on multiple versions of Rails
---

<p>
  <img src='/images/how-not-1.jpg' alt="Michael Heizer's North, East, South, West, 1967/2002 seen at DIA:Beacon." class='img-rounded img-responsive' />
  <a href='https://au.pinterest.com/pin/287386019952749263/'>
    <small><em>Michael Heizer's North, East, South, West, 1967/2002 seen at DIA:Beacon.</em></small>
  </a>
</p>

I [fixed a Javascript bug](https://github.com/Everapps/stripe-rails/pull/73) and wanted to write a system test for it. Unfortunately I have to run the test on multiple versions of Rails, and system tests only started appearing with newer versions of Rails. Here are a few things I tried to stop it from crashing on Rails 4.

According to the Rails docs you need two files to get started with system tests,

```ruby
# application_system_test_case.rb
class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :poltergeist
end

# dummy_spec.rb
require 'application_system_test_case'

class DummySpec < ApplicationSystemTestCase
  test "loading the default javascript helper" do
    visit new_stripe_url
    assert_text 'This page tests the loading and initialization of Stripe JS'
  end
end
```

While this works fine on Rails 5.1, running the same test on Rails 4 will cause a `NameError` since `ActionDispatch::SystemTestCase` does not exist. An easy way to get around it is by rescuing it,

```ruby
# application_system_test_case.rb (nothing changed!)
class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :poltergeist
end

# dummy_spec.rb (adds a rescue)
begin
  require 'application_system_test_case'

  class DummySpec < ApplicationSystemTestCase
    test "loading the default javascript helper" do
      visit new_stripe_url
      assert_text 'This page tests the loading and initialization of Stripe JS'
    end
  end
rescue NameError
  warn 'WARNING: Skipping because this version of Rails version does not support it!'
end
```

But this looked terrible. I ended up using a null class,

```ruby
# application_system_test_case.rb (selectively loads the null class)
SystemTestCaseKlass = defined?(ActionDispatch::SystemTestCase) ? ActionDispatch::SystemTestCase : NullSystemTestCase

class ApplicationSystemTestCase < SystemTestCaseKlass
  driven_by :poltergeist
end

# null_system_test_case.rb (new file!)
class NullSystemTestCase
  def self.driven_by(_, _); end

  def self.test(_)
    warn 'WARNING: Skipping because this version of Rails does not support it!'
  end
end

# dummy_spec.rb (nothing changed)
require 'application_system_test_case'

class DummySpec < ApplicationSystemTestCase
  test "loading the default javascript helper" do
    visit new_stripe_url
    assert_text 'This page tests the loading and initialization of Stripe JS'
  end
end
```

I think this looks nicer! And if I ever wanted to add another system test I won't have to futz around with rescues. Anyways, this is my take on how not to crash my tests when I'm using newer Rails features. How would you have done it?
