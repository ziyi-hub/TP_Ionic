
describe('Update a topic', () => {
  it('add topics', () => {
    cy.visit('http://localhost:4200')
    cy.get('[data-testid="topics"]').should('have.length', 0)
    cy.get('[data-testid="open-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topic-name"]').type('Add Topic 1{enter}')
    cy.get('[data-testid="confirm-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topics"]').should('have.length', 1)
    cy.get('[data-testid="topics"]').first().find('ion-label').contains('Add Topic 1')

    cy.get('ion-item-sliding')
      .find('ion-item-option[color="success"]')
      .click({force:true});

    cy.get('ion-input[data-testid="topic-name"]').first().type("{selectall}Jane Lane")
    cy.get('[data-testid="confirm-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topics"]').should('have.length', 1)
    cy.get('[data-testid="topics"]').first().find('ion-label').contains('Jane Lane')
  })
})
