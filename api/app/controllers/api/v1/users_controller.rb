class Api::V1::UsersController < Api::BaseController
  before_action :doorkeeper_authorize!

  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: user.errors.to_hash(true), status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email_address, :password)
  end
end
