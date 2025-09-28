Rails.application.config.session_store :cookie_store,
  key: '_mono_session',
  same_site: :lax,
  secure: false
