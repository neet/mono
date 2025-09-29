Rails.application.config.session_store :cookie_store,
  key: "_mono_session",
  httponly: true,
  secure: Rails.env.production?
