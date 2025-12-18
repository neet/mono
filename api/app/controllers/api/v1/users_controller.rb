class Api::V1::UsersController < Api::V1::BaseController
  before_action :doorkeeper_authorize!

  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: user.errors.to_hash(true), status: :unprocessable_entity
    end
  end

  def me
    render json: {
      "sub" => current_user.id.to_s,
      "email" => current_user.email_address,
      "name" => current_user.email_address
      # "email_verified" => false
    }
  end

  private

  def user_params
    params.require(:user).permit(:email_address, :password)
  end
end
