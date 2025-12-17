class Web::BaseController < ActionController::API
  include ActionController::Cookies
  include Web::Authentication
end
