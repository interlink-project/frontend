const { defineConfig } = require("cypress");
const { GoogleSocialLogin } = require("cypress-social-logins").plugins;
const secrets = require("./src/.secrets.json");

module.exports = defineConfig({
  viewportWidth: 1100,
  viewportHeight: 1000,
  env: {
    cypress_email_login: secrets.cypress_email_login,
    cypress_email_password: secrets.cypress_email_password,
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },

  chromeWebSecurity: false,
});
