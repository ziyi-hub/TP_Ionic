
describe('Delete a category', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200')
    cy.get('[data-testid="categories"]').should('have.length', 0)
    cy.get('[data-testid="open-new-category-modal-btn"]').click()
    cy.get('[data-testid="category-name"]').type('Add Category 1{enter}')
    cy.get('[data-testid="confirm-new-category-modal-btn"]').click()
    cy.get('[data-testid="categories"]').should('have.length', 1)
    cy.get('[data-testid="categories"]').first().find('ion-label').contains('Add Category 1')

    cy.get('ion-item-sliding')
      .find('ion-item-option[color="danger"]')
      .click({force:true});

    cy.contains("OK").click();
    cy.get('[data-testid="categories"]').should('have.length', 0)
  })
})


