const loginUrl = "http://127.0.0.1:5500/login.html";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Index Page Login Tests", () => {
  it("Should load the index page successfully", () => {
    cy.visit(loginUrl);
    cy.contains("Login").should("be.visible");
    cy.screenshot("index_page_loaded");
  });

  it("Should login successfully as admin with valid credentials", () => {
    cy.visit(loginUrl);

    cy.get('input[name="uname"]').should("exist").type("thilinaD");
    cy.get('input[name="psw"]').should("exist").type("12345");
    cy.get('button[type="submit"]').should("exist").click();
  });

  it("Should display an error message for invalid credentials and redirect to index.php", () => {
    cy.visit(loginUrl);

    cy.get('input[name="uname"]').should("exist").type("wrongUser");
    cy.get('input[name="psw"]').should("exist").type("wrongPassword");
    cy.get('button[type="submit"]').should("exist").click();

    cy.on("window:alert", (text) => {
      expect(text).to.equal("Invalid username or password.");
    });

    cy.url().should("eq", loginUrl);
    cy.screenshot("invalid_login_redirect");
  });

  it("Should login successfully as a regular user and redirect to velvetVogue page", () => {
    cy.visit(loginUrl);

    cy.get('input[name="uname"]').should("exist").type("thilinaDtm");
    cy.get('input[name="psw"]').should("exist").type("1234");
    cy.get('button[type="submit"]').should("exist").click();

    cy.url()
      .should("include", "/velvetVogue.html")
      .then(() => {
        cy.screenshot("user_login_success");
      });
  });
});
