describe("Check whether services are up", () => {
  it("Checking homepage", () => {
    let url = Cypress.config().baseUrl;
    cy.log(url);
    cy.visit(url);
    cy.get("[data-cy=home-1-1]").should("exist");
  });
});
