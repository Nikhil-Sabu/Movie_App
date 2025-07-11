describe('Search Functionality E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
      // Wait for movies to load
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display search section correctly', () => {
      // Check search section elements
      cy.get('.search-section').should('be.visible')
      cy.get('.search-title').should('contain.text', 'FIND YOUR MOVIE')
      cy.get('.search-input').should('be.visible')
      cy.get('.search-btn').should('contain.text', 'SEARCH')
    })
  
    it('should have correct placeholder text', () => {
      cy.get('.search-input')
        .should('have.attr', 'placeholder', 'What do you want to watch?')
    })
  
    it('should filter movies when typing in search box', () => {
      // Get initial movie count
      cy.get('.movie-card').then($cards => {
        const initialCount = $cards.length
        
        // Type in search box
        cy.get('.search-input').type('Knives')
        
        // Wait for search to filter results
        cy.wait(500)
        
        // Check that results are filtered
        cy.get('.movie-card').should('have.length.lessThan', initialCount)
        
        // Check that visible movies contain search term
        cy.get('.movie-title').each($title => {
          cy.wrap($title).invoke('text').should('match', /knives/i)
        })
      })
    })
  
    it('should show clear button when search has text', () => {
      // Type in search box
      cy.get('.search-input').type('Action')
      
      // Check if clear button appears
      cy.get('.clear-btn').should('be.visible').should('contain.text', 'CLEAR')
    })
  
    it('should clear search when clear button is clicked', () => {
      // Type in search box
      cy.get('.search-input').type('Action')
      cy.get('.clear-btn').should('be.visible')
      
      // Click clear button
      cy.get('.clear-btn').click()
      
      // Check if search input is cleared
      cy.get('.search-input').should('have.value', '')
      cy.get('.clear-btn').should('not.exist')
    })
  
    it('should show no results message for non-existent movie', () => {
      // Search for non-existent movie
      cy.get('.search-input').type('NonExistentMovie123')
      
      // Wait for search to complete
      cy.wait(500)
      
      // Check for no results
      cy.get('.movie-card').should('have.length', 0)
      cy.contains('No movies found').should('be.visible')
    })
  
    it('should restore all movies when search is cleared', () => {
      // Get initial count
      cy.get('.movie-card').then($initialCards => {
        const initialCount = $initialCards.length
        
        // Search for something
        cy.get('.search-input').type('Action')
        cy.wait(500)
        
        // Clear search
        cy.get('.search-input').clear()
        cy.wait(500)
        
        // Check that all movies are back
        cy.get('.movie-card').should('have.length', initialCount)
      })
    })
  })