
describe('Update a category', () => {
  it('add categories', () => {
    cy.visit('http://localhost:4200')
    cy.get('[data-testid="categories"]').should('have.length', 0)
    cy.get('[data-testid="open-new-category-modal-btn"]').click()
    cy.get('[data-testid="category-name"]').type('Add Category 1{enter}')
    cy.get('[data-testid="confirm-new-category-modal-btn"]').click()
    cy.get('[data-testid="categories"]').should('have.length', 1)
    cy.get('[data-testid="categories"]').first().find('ion-label').contains('Add Category 1')

    cy.get('ion-item-sliding')
      .find('ion-item-option[color="success"]')
      .click({force:true});

    cy.get('ion-input[data-testid="category-name"]').first().type("{selectall}Jane Lane")
    cy.get('[data-testid="confirm-new-category-modal-btn"]').click()
    cy.get('[data-testid="categories"]').should('have.length', 1)
    cy.get('[data-testid="categories"]').first().find('ion-label').contains('Jane Lane')
  })
})
