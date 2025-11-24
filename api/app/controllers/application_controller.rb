class ApplicationController < ActionController::API
  before_action :authenticate_user
  around_action :switch_locale

  def switch_locale(&action)
    locale = extract_locale_from_accept_language_header
    I18n.with_locale(locale, &action)
  end

  private

  def authenticate_user
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def extract_locale_from_accept_language_header
    accept_language = request.env["HTTP_ACCEPT_LANGUAGE"]
    return if accept_language.nil?
    accept_language.scan(/^[a-z]{2}/).first
  end
end
