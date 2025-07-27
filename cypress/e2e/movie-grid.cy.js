describe('Movie Grid E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
      
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display movies in grid layout', () => {
      
      cy.get('.movie-grid').should('be.visible')
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display movie count', () => {
      
      cy.get('.movies-count').should('be.visible')
      cy.get('.count-badge').should('be.visible')
      cy.get('.count-text').should('contain.text', 'found')
    })
  
    it('should display genre filter buttons', () => {
      const genres = ['ALL', 'ACTION', 'CRIME', 'HORROR', 'COMEDY', 'DOCUMENTARY', 'DRAMA']
      
      genres.forEach(genre => {
        cy.get('.genre-btn').contains(genre).should('be.visible')
      })
    })
  
    it('should filter movies by genre', () => {
      
      cy.get('.genre-btn').contains('ACTION').click()
      
      
      cy.get('.genre-btn').contains('ACTION').should('have.class', 'active')
      
      
      cy.wait(500)
      
      
      cy.get('.movie-card').each($card => {
        cy.wrap($card).find('.movie-genre').invoke('text').should('match', /action|adventure/i)
      })
    })
  
    it('should have working sort dropdown', () => {
      
      cy.get('.sort-select').should('be.visible')
      
      
      cy.get('.sort-select option').should('contain.text', 'RELEASE DATE')
      cy.get('.sort-select option').should('contain.text', 'TITLE')
      cy.get('.sort-select option').should('contain.text', 'RATING')
    })
  
    it('should sort movies by title', () => {
      
      cy.get('.sort-select').select('title')
      
      
      cy.wait(500)
      
      
      cy.get('.movie-title').then($titles => {
        const titles = Array.from($titles).map(el => el.textContent)
        const sortedTitles = [...titles].sort()
        expect(titles).to.deep.equal(sortedTitles)
      })
    })
  
    it('should open movie details when card is clicked', () => {
      
      cy.get('.movie-card').first().click()
      
      
      cy.get('.movie-detail-overlay').should('be.visible')
      cy.get('.movie-detail-content').should('be.visible')
    })
  })