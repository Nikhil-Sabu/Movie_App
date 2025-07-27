describe('Header Component E2E Tests', () => {
    beforeEach(() => {
      
      cy.visit('/')
    })
  
    it('should display the logo correctly', () => {
      
      cy.get('header').should('be.visible')
      
      
      cy.get('.logo').should('be.visible')
      cy.get('.nix').should('contain.text', 'Nix')
      cy.get('.mov').should('contain.text', 'Movies')
    })
  
    it('should display the add movie button', () => {
      
      cy.get('.add-movie-btn')
        .should('be.visible')
        .should('contain.text', '+ ADD MOVIE')
        .should('not.be.disabled')
    })
  
    it('should open add movie modal when button is clicked', () => {
      
      cy.get('.add-movie-btn').click()
      
      
      cy.get('.modal-overlay').should('be.visible')
      cy.get('.modal-content').should('be.visible')
      cy.contains('ADD MOVIE').should('be.visible')
    })
  
    it('should close add movie modal when close button is clicked', () => {
      
      cy.get('.add-movie-btn').click()
      cy.get('.modal-overlay').should('be.visible')
      
      
      cy.get('.close-btn').click()
      
      
      cy.get('.modal-overlay').should('not.exist')
    })
  
    it('should close modal when clicking outside', () => {
      
      cy.get('.add-movie-btn').click()
      cy.get('.modal-overlay').should('be.visible')
      
      
      cy.get('.modal-overlay').click({ force: true })
      
      
      cy.get('.modal-overlay').should('not.exist')
    })
  })