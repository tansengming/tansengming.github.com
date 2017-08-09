---
layout: post
---

I [fixed a Javascript bug with the Stripe Rails gem](https://github.com/Everapps/stripe-rails/pull/73) and wanted to write a system test for it. Unfortunately I run tests for the gem on multiple versions of Rails and system tests only started appearing with Rails 5.1. What could I do?

## Setup
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

When I run this on Rails 4 it would crash because Rails 4 doesn't have `ActionDispatch::SystemTestCase`. An easy way to get around it is by rescuing it,

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
  warn 'WARNING: Skipping System test because this version of Rails version does not support it!'
end
```

But this looked terrible. I ended up using a null object,

```ruby
# application_system_test_case.rb (loads the null class)
SystemTestCaseKlass = defined?(ActionDispatch::SystemTestCase) ? ActionDispatch::SystemTestCase : NullSystemTestCase

class ApplicationSystemTestCase < SystemTestCaseKlass
  driven_by :poltergeist
end

# null_system_test_case.rb (new file!)
class NullSystemTestCase
  def self.driven_by(_, _); end

  def self.test(_)
    warn 'WARNING: Skipping system test because this version of Rails does not support it!'
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

This looks nicer and if I ever wanted to add another system test I won't have to futz around with rescues anymore. Anyways, this is my take on how not to crash my tests when I have newer Rails features. How would you have done it?
