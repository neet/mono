class Api::V1::SessionsController < ApplicationController
  allow_unauthenticated_access only: [ :create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> {
    render json: { "error" => I18n.t("sessions.rate_limit") }, status: :too_many_requests
  }

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      head :ok
    else
      render json: { "error" => I18n.t("sessions.invalid") }, status: :unprocessable_entity
    end
  end

  def destroy
    terminate_session
    head :ok
  end
end
