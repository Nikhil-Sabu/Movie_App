describe('Header Component E2E Tests', () => {
    beforeEach(() => {
      // Visit the app before each test
      cy.visit('/')
    })
  
    it('should display the logo correctly', () => {
      // Check if header exists
      cy.get('header').should('be.visible')
      
      // Check logo elements
      cy.get('.logo').should('be.visible')
      cy.get('.nix').should('contain.text', 'Nix')
      cy.get('.mov').should('contain.text', 'Movies')
    })
  
    it('should display the add movie button', () => {
      // Check if add movie button exists and is clickable
      cy.get('.add-movie-btn')
        .should('be.visible')
        .should('contain.text', '+ ADD MOVIE')
        .should('not.be.disabled')
    })
  
    it('should open add movie modal when button is clicked', () => {
      // Click the add movie button
      cy.get('.add-movie-btn').click()
      
      // Check if modal opens
      cy.get('.modal-overlay').should('be.visible')
      cy.get('.modal-content').should('be.visible')
      cy.contains('ADD MOVIE').should('be.visible')
    })
  
    it('should close add movie modal when close button is clicked', () => {
      // Open modal
      cy.get('.add-movie-btn').click()
      cy.get('.modal-overlay').should('be.visible')
      
      // Close modal
      cy.get('.close-btn').click()
      
      // Check if modal is closed
      cy.get('.modal-overlay').should('not.exist')
    })
  
    it('should close modal when clicking outside', () => {
      // Open modal
      cy.get('.add-movie-btn').click()
      cy.get('.modal-overlay').should('be.visible')
      
      // Click outside modal (on overlay)
      cy.get('.modal-overlay').click({ force: true })
      
      // Check if modal is closed
      cy.get('.modal-overlay').should('not.exist')
    })
  })