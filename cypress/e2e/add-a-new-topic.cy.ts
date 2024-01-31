
describe('Add a new topic', () => {
  it('add topics', () => {
    cy.visit('http://localhost:4200')
    cy.get('[data-testid="topics"]').should('have.length', 0)
    cy.get('[data-testid="open-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topic-name"]').type('Add Topic 1{enter}')
    cy.get('[data-testid="confirm-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topics"]').should('have.length', 1)
    cy.get('[data-testid="topics"]').first().find('ion-label').contains('Add Topic 1')
  })
})


