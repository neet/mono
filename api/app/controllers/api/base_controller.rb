class Api::BaseController < ActionController::API
  # https://doorkeeper.gitbook.io/guides/ruby-on-rails/protecting-your-resources#authenticated-resource-owner
  def current_user
    User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end
end
