describe('Delete a post', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200')

    cy.get('[data-testid="topics"]').should('have.length', 0)
    cy.get('[data-testid="open-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topic-name"]').type('Add Topic 1{enter}')
    cy.get('[data-testid="confirm-new-topic-modal-btn"]').click()
    cy.get('[data-testid="topics"]').should('have.length', 1)
    cy.get('[data-testid="topics"]').first().find('ion-label').contains('Add Topic 1')

    cy.get('[data-testid="posts"]').should('have.length', 0)
    cy.get('[data-testid="topics"]').first().click()
    cy.get('[data-testid="open-new-post-modal-btn"]').click()
    cy.get('[data-testid="post-name"]').type('Post A{enter}')
    cy.get('[data-testid="post-desc"]').type('Enter post description {enter}')
    cy.get('[data-testid="confirm-new-post-modal-btn"]').click()
    cy.get('[data-testid="posts"]').should('have.length', 1)
    cy.get('[data-testid="posts"]').find('ion-label').contains('Post A')


    cy.get('ion-item-sliding[data-testid="posts"]')
      .find('ion-item-option[color="danger"]')
      .click({force:true});

    cy.contains("OK").click();

    cy.get('[data-testid="posts"]').should('have.length', 0)
  })

})
