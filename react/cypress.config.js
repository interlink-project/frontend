const { defineConfig } = require("cypress");
const { GoogleSocialLogin } = require("cypress-social-logins").plugins;
const secrets = require("../.secrets.json");

module.exports = defineConfig({
  env: {
    cypress_email_login: secrets.cypress_email_login,
    cypress_email_password: secrets.cypress_email_password,
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },

  chromeWebSecurity: false,
});
