describe("Check whether services are up", () => {
  it("Checking homepage", () => {
    const url = Cypress.config().baseUrl || "http://localhost";
    cy.log(url);
    cy.visit(url);
    cy.get("[data-cy=home-1-1]").should("exist");
  });
});
