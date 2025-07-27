describe('Search Functionality E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
      
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display search section correctly', () => {
      
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
      
      cy.get('.movie-card').then($cards => {
        const initialCount = $cards.length
        
        
        cy.get('.search-input').type('Knives')
        
        
        cy.wait(500)
        
        
        cy.get('.movie-card').should('have.length.lessThan', initialCount)
        
        
        cy.get('.movie-title').each($title => {
          cy.wrap($title).invoke('text').should('match', /knives/i)
        })
      })
    })
  
    it('should show clear button when search has text', () => {
      
      cy.get('.search-input').type('Action')
      
      
      cy.get('.clear-btn').should('be.visible').should('contain.text', 'CLEAR')
    })
  
    it('should clear search when clear button is clicked', () => {
      
      cy.get('.search-input').type('Action')
      cy.get('.clear-btn').should('be.visible')
      
      
      cy.get('.clear-btn').click()
      
      
      cy.get('.search-input').should('have.value', '')
      cy.get('.clear-btn').should('not.exist')
    })
  
    it('should show no results message for non-existent movie', () => {
      
      cy.get('.search-input').type('NonExistentMovie123')
      
      
      cy.wait(500)
      
      
      cy.get('.movie-card').should('have.length', 0)
      cy.contains('No movies found').should('be.visible')
    })
  
    it('should restore all movies when search is cleared', () => {
      
      cy.get('.movie-card').then($initialCards => {
        const initialCount = $initialCards.length
        
        
        cy.get('.search-input').type('Action')
        cy.wait(500)
        
        
        cy.get('.search-input').clear()
        cy.wait(500)
        
        
        cy.get('.movie-card').should('have.length', initialCount)
      })
    })
  })