class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [ :create, :destroy ]

  def create
    user = User.find_by(email: params[:email].to_s.downcase.strip)

    if user&.authenticate(params[:password])
      reset_session
      session[:user_id] = user.id

      render status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    reset_session
    head :no_content
  end
end
