import { generateRandomString } from "../utils/generateRandomString";
const randomString = generateRandomString(6);
const organizationName = `test-org-${randomString}`;
const teamName = `test-team-${randomString}`;
const tester2FullNameSlugified = "test_2_tester_2";
const tester2 = "tester.interlink%2B2@gmail.com";

describe("Team management to initiate co-production process", () => {
  it("1 - Create a new organization	", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
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
    cy.get(".MuiTableRow-hover", { timeout: 20000 })
      .contains(organizationName)
      .should("exist");

    //
  });

  it("2 - Create a new team", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
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
    cy.get(`[data-cy="${userToSelect}"]`, { timeout: 20000 }).click();
    cy.get('[data-cy="team-create-next"]').click();
    // Usually takes 20 seconds to create a team
    const teamToSelect = `cell-team-name-${teamName}`;
    cy.get(`[data-cy="${teamToSelect}"]`, { timeout: 35000 }).should("exist");
  });

  it("3 - Create a new team via import from CSV", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
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
    cy.get('[data-cy="member-data-item"]').should("have.length", 3);
    cy.get('[data-cy="team-create-next"]').click();
    const teamToSelect = `cell-team-name-${teamName}`;
    cy.get(`[data-cy="${teamToSelect}"]`, { timeout: 55000 }).should("exist");
    cy.wait(3000);
    cy.get('[data-cy="team-create-next"]').click();
    cy.wait(10000);
  });
  it("4 - Add a new Admin", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
    cy.get(`[data-cy="Open-${organizationName}"]`, { timeout: 6000 }).click();
    cy.get('[data-cy="organization-administrators-tab"]').click();
    cy.get('[data-cy="add-user-input"]', { timeout: 8000 }).type(
      "tester.interlink%2B2@gmail.com"
    );
    const userToSelect = `add-user-${tester2.replace("%2B", "+")}`;
    cy.get(`[data-cy="${userToSelect}"]`, { timeout: 7000 }).click();
    cy.wait(1000);
    cy.get('[data-cy="alert-success-userList-modified"]').should("exist");
  });
});

describe("Manage existing team", () => {
  after(() => {
    // Delete the organization
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
    cy.get(`[data-cy="Open-${organizationName}"]`).click();
    cy.get('[data-cy="edit-organization-button"]').click();
    cy.get('[data-cy="delete-organization-button"]').click();
    cy.get('[data-cy="confirm-delete-organization-button"]').click();
  });

  it("1 - window shows up, displaying team details, including its members	", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
    cy.get(`[data-cy="Open-${organizationName}"]`, { timeout: 15000 }).click();
    const teamToSelect = `cell-team-name-${teamName}`;
    cy.get(`[data-cy="${teamToSelect}"]`, { timeout: 35000 }).click();
    cy.get('[data-cy="table-body-userList"]')
      .contains("test 2")
      .should("exist");
    cy.get('[data-cy="table-body-userList"]')
      .contains("test 2")
      .should("exist");
  });

  it("2 - Edit team details: edit name, description, logo and delete a user", () => {
    cy.login();
    const baseUrl = Cypress.config().baseUrl || "http://localhost";
    cy.visit(`${baseUrl}/dashboard/organizations`);
    cy.get(`[data-cy="Open-${organizationName}"]`, { timeout: 15000 }).click();
    const teamToSelect = `cell-team-name-${teamName}`;
    cy.get(`[data-cy="${teamToSelect}"]`, { timeout: 35000 }).click();
    cy.get('[data-cy="table-body-userList"]')
      .contains("test 2")
      .should("exist");
    cy.get('[data-cy="edit-team"]').click();

    cy.get('[data-cy="edit-team-name"]').clear().type(`${teamName} EDITED`);
    cy.get('[data-cy="edit-team-description"]').type(
      "Testing team description EDITED"
    );
    cy.get('[data-cy="save-changes-team"]', { timeout: 35000 }).click();
    cy.get('[data-cy="team-name"]')
      .contains(`${teamName} EDITED`)
      .should("exist");
    cy.get('[data-cy="team-description"]')
      .contains("Testing team description EDITED")
      .should("exist");
    cy.get(`[data-cy="${teamToSelect}"]`, { timeout: 35000 }).click();
    cy.get('[data-cy="test_2_tester_2-user-actions"]').click();
    cy.get('[data-cy="user-action-Remove member"]').click();
    cy.get('[data-cy="alert-success-userList-modified"').should("exist");
  });
});
