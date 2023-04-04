import "cypress-file-upload";

Cypress.Commands.add("LoginWithEmail", () => {
  const url = Cypress.config().baseUrl || "http://localhost";
  cy.visit(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
    timeout: 60000,
  });
  cy.get('[data-cy="home-1-1"]').should("exist");
  cy.get('[data-cy="home-1-2"]').click();
  cy.get('[data-cy="login-required"]').should("exist");
  cy.get('[data-cy="Login"]').click();

  cy.get("#username").type(Cypress.env("cypress_email_login"));
  cy.get("#password").type(Cypress.env("cypress_email_password"), {
    sensitive: true,
  });
  cy.get(".row > .btn").contains("Sign In").click();
  cy.reload();
  cy.get('[data-cy="Welcome"').contains("interlink-tester");
  cy.get('[data-cy="Welcome"').contains("interlink-tester");
});

Cypress.Commands.add("login", (username, password) => {
  cy.session({}, () => {
    cy.LoginWithEmail();
  });
});
