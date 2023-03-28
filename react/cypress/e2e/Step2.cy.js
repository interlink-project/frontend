import { generateRandomString } from "../utils/generateRandomString";
const randomString = generateRandomString(6);
const organizationName = `test-org-${randomString}`;
const teamName = `test-team-${randomString}`;
const tester1 = "tester.interlink%2B1@gmail.com";
const tester2 = "tester.interlink%2B2@gmail.com";

describe("Team management to initiate co-production process", () => {
  /*
    after(() => {
    // Delete the organization
    cy.login();
    cy.visit("/dashboard/organizations");
    cy.get(`[data-cy="Open-${organizationName}"]`).click();
    cy.get('[data-cy="edit-organization-button"]').click();
    cy.get('[data-cy="delete-organization-button"]').click();
    cy.get('[data-cy="confirm-delete-organization-button"]').click();
  });
  */

  it("1 - Create a new organization	", () => {
    cy.login();
    cy.visit("/dashboard/organizations");
    cy.get('[data-cy="create-new-organization"]').click();
    cy.get('[data-cy="create-organization-name"]').type(organizationName);
    cy.get('[data-cy="create-organization-description"]').type(
      "Testing description"
    );
    cy.get('[data-cy="create-organization-team-creation-permission"]').click();
    //data-value="anyone"
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('[data-cy="create-organization-default-team-type"]').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('[data-cy="create-organization-button"]').click();
    cy.get(".MuiTableRow-hover").contains(organizationName).should("exist");

    //
  });
  /*
  it("2 - Create a new team", () => {
    cy.login();
    cy.visit("/dashboard/organizations");
    cy.get(`[data-cy="Open-${organizationName}"]`).click();
    cy.get('[data-cy="create-team-button"]').click();
    const fixtureFile = "cypress/fixtures/test_team_image.png";
    cy.get("input[type=file]").selectFile(fixtureFile, {
      force: true,
    });
    cy.get('[data-cy="team-create-name"]').type(teamName);
    cy.get('[data-cy="team-create-description"]').type(
      "Testing team description"
    );
    cy.get('[data-cy="team-create-type"]').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('[data-cy="team-create-next"]').click();
    cy.get('[data-cy="add-user-input"]').type("tester.interlink%2B2@gmail.com");
    const userToSelect = `add-user-${tester2.replace("%2B", "+")}`;
    cy.wait(1000);
    cy.get(`[data-cy="${userToSelect}"]`).click();
    cy.get('[data-cy="team-create-next"]').click();
    // Usually takes 20 seconds to create a team
    cy.wait(25000);
    const teamToSelect = `cell-team-name-${teamName}`;
    cy.get(`[data-cy="${teamToSelect}"]`).should("exist");
  });
*/
  it("3 - Create a new team via import from CSV", () => {
    cy.login();
    cy.visit("/dashboard/organizations");
    cy.get(`[data-cy="Open-${organizationName}"]`).click();
    cy.get('[data-cy="create-team-button"]').click();
    const fixtureFile = "cypress/fixtures/test_team_image.png";
    cy.get("input[type=file]").selectFile(fixtureFile, {
      force: true,
    });
    cy.get('[data-cy="team-create-name"]').type(teamName);
    cy.get('[data-cy="team-create-description"]').type(
      "Testing team description"
    );
    cy.get('[data-cy="team-create-type"]').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('[data-cy="team-create-next"]').click();
    const fixtureFileCSV = "cypress/fixtures/test_team_in_CSV.csv";
    cy.get("input[type=file]").selectFile(fixtureFileCSV, {
      force: true,
    });
  });
});
