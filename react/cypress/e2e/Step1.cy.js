describe("Verify that users can log in and/or register to access the Collaborative", () => {
  it("STEP1 A: Verify that users can log in with a Google's Button (Until see de Google's Button)", () => {
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

    cy.origin("aac.platform.smartcommunitylab.it", () => {
      cy.get(".provider-google").contains("Google").should("exist");
    });
  });

  it("STEP1 B: Verify that users can log in with an email and password", () => {
    cy.LoginWithEmail();
    cy.get('[data-cy="Welcome"]').should("exist");
    cy.get('[datacy="Organizations-page"]').should("not.be.disabled");
    cy.get('[datacy="Organizations-page"]').click();
    cy.get('[data-cy="create-new-organization"]').should("exist");
    cy.log("✅ First criteria is OK - Team management");
    cy.get('[datacy="Workspace-page"]').should("not.be.disabled");
    cy.get('[datacy="Workspace-page"]').click();
    cy.get('[data-cy="create-new-process"]').should("exist");
    cy.log("✅ Second criteria is OK - Co-production project management");
    cy.get('[datacy="Catalogue-page"]').should("not.be.disabled");
    cy.get('[datacy="Catalogue-page"]').click();
    cy.get('[data-cy="interlinkers-catalogue-title"]').should("exist");
    cy.wait(1000);
    cy.get('[data-cy="interlinkers-catalogue-title"]').should(
      "not.include.text",
      "0 INTERLINKERs "
    );
    cy.get('[data-cy="search-input-interlinkers"]').type(
      "AAC - Authentication and Authorization Controller"
    );
    cy.wait(500);
    cy.get('[data-cy="interlinkers-catalogue-title"]').should(
      "include.text",
      "1 INTERLINKERs "
    );
    cy.get(
      '[data-cy="interlinker-title-AAC - Authentication and Authorization Controller"]'
    ).should("exist");
    cy.log(
      "✅ Third criteria is OK - INTERLINKERs catalogue browsing, searching and filtering"
    );
    cy.get('[data-cy="account-avatar"]').click();
    cy.get('[data-cy="logout-button"]').click();
    cy.get(".btn-primary").contains("Confirm").click();
    cy.get('[data-cy="home-1-1"]').should("exist");
  });
});
