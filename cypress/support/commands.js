// Custom commands for reusable actions

Cypress.Commands.add('openAddMovieModal', () => {
  cy.get('.add-movie-btn').click()
  cy.get('.modal-overlay').should('be.visible')
})

Cypress.Commands.add('closeModal', () => {
  cy.get('.close-btn').first().click()
  cy.get('.modal-overlay').should('not.exist')
})

Cypress.Commands.add('searchForMovie', (searchTerm) => {
  cy.get('.search-input').clear().type(searchTerm)
  cy.wait(500) // Wait for debounced search
})

Cypress.Commands.add('selectGenre', (genre) => {
  cy.get('.genre-btn').contains(genre).click()
  cy.get('.genre-btn').contains(genre).should('have.class', 'active')
})

Cypress.Commands.add('waitForMoviesToLoad', () => {
  cy.get('.movie-card').should('have.length.greaterThan', 0)
})

// Wait for app to be ready
Cypress.Commands.add('waitForAppToLoad', () => {
  cy.get('.App').should('be.visible')
  cy.get('.header').should('be.visible')
  cy.get('.search-section').should('be.visible')
})
