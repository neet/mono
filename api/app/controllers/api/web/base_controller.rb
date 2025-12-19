class Api::Web::BaseController < ActionController::Base
  include Api::Web::Authentication
  include LocaleSwitching
end
