const env = window._jsenv || process.env;

export const PRODUCTION_MODE = env.NODE_ENV === "production";
export const { REACT_APP_ENABLE_REDUX_DEV_TOOLS } = env;

export const { REACT_APP_DOMAIN } = env;
export const REACT_APP_COMPLETE_DOMAIN = `${env.REACT_APP_PROTOCOL}${env.REACT_APP_DOMAIN}`;

export const DEFAULT_LANGUAGE = env.REACT_APP_DEFAULT_LANGUAGE || "en";
export const ALLOWED_LANGUAGES = env.REACT_APP_ALLOWED_LANGUAGES
  ? env.REACT_APP_ALLOWED_LANGUAGES.split(",")
  : ["en", "es", "lv", "it"];

export const { REACT_APP_MATOMO_ID } = env;

export const SENTRY_DSN =
  env.REACT_APP_SENTRY_DSN ||
  "https://9c2c4ae5750343deb167d2bdee365657@o4504881526669312.ingest.sentry.io/4504881531256832";
