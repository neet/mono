class Web::BaseController < ActionController::Base
  include Web::Authentication
  include LocaleSwitching
end
