class Api::Web::PasswordsController < Api::Web::BaseController
  allow_unauthenticated_access
  before_action :set_user_by_token, only: %i[ update ]

  # POST /passwords
  def create
    if user = User.find_by(email_address: params[:email_address])
      PasswordsMailer.reset(user).deliver_later
    end

    head :ok
  end

  # PATCH/PUT /passwords
  def update
    if @user.update(params.permit(:password, :password_confirmation))
      head :ok
    else
      render json: { "error" => I18n.t("passwords.invalid") }, status: :unprocessable_entity
    end
  end

  private
    def set_user_by_token
      @user = User.find_by_password_reset_token!(params[:token])
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      render json: { "error" => I18n.t("passwords.expired") }, status: :unprocessable_entity
    end
end
