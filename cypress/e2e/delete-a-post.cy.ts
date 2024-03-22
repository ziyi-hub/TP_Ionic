describe('Delete a recipe', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200')

    cy.get('[data-testid="categories"]').should('have.length', 0)
    cy.get('[data-testid="open-new-category-modal-btn"]').click()
    cy.get('[data-testid="category-name"]').type('Add Category 1{enter}')
    cy.get('[data-testid="confirm-new-category-modal-btn"]').click()
    cy.get('[data-testid="categories"]').should('have.length', 1)
    cy.get('[data-testid="categories"]').first().find('ion-label').contains('Add Category 1')

    cy.get('[data-testid="recipes"]').should('have.length', 0)
    cy.get('[data-testid="categories"]').first().click()
    cy.get('[data-testid="open-new-recipe-modal-btn"]').click()
    cy.get('[data-testid="recipe-name"]').type('Recipe A{enter}')
    cy.get('[data-testid="recipe-desc"]').type('Enter recipe description {enter}')
    cy.get('[data-testid="confirm-new-recipe-modal-btn"]').click()
    cy.get('[data-testid="recipes"]').should('have.length', 1)
    cy.get('[data-testid="recipes"]').find('ion-label').contains('Recipe A')


    cy.get('ion-item-sliding[data-testid="recipes"]')
      .find('ion-item-option[color="danger"]')
      .click({force:true});

    cy.contains("OK").click();

    cy.get('[data-testid="recipes"]').should('have.length', 0)
  })

})
