class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Authentication
  around_action :switch_locale

  def switch_locale(&action)
    locale = extract_locale_from_accept_language_header
    I18n.with_locale(locale, &action)
  end

  private

  def extract_locale_from_accept_language_header
    accept_language = request.env["HTTP_ACCEPT_LANGUAGE"]
    return if accept_language.nil?
    accept_language.scan(/^[a-z]{2}/).first
  end
end
