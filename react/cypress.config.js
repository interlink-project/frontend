const { defineConfig } = require("cypress");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.secrets" });

const cypressEmailLogin = process.env.CYPRESS_EMAIL_LOGIN;
const cypressEmailPass = process.env.CYPRESS_EMAIL_PASS;

module.exports = defineConfig({
  viewportWidth: 1100,
  viewportHeight: 1000,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  env: {
    cypress_email_login: cypressEmailLogin || "",
    cypress_email_password: cypressEmailPass || "",
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },

  chromeWebSecurity: false,
});
