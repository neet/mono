ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

module DoorkeeperTestHelper
  def oauth_headers(user:, scopes: "read write", application: doorkeeper_applications(:default))
    token = Doorkeeper::AccessToken.create!(
      application: application,
      resource_owner_id: user.id,
      scopes: scopes,
      expires_in: 2.hours
    )
    { "Authorization" => "Bearer #{token.token}" }
  end
end

# https://guides.rubyonrails.org/testing.html#test-helpers
class ActionDispatch::IntegrationTest
  include DoorkeeperTestHelper
end
