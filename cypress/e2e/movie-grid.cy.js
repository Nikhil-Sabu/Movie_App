describe('Movie Grid E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
      // Wait for movies to load
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display movies in grid layout', () => {
      // Check if movie grid exists
      cy.get('.movie-grid').should('be.visible')
      cy.get('.movie-card').should('have.length.greaterThan', 0)
    })
  
    it('should display movie count', () => {
      // Check movie count display
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
      // Click on ACTION genre
      cy.get('.genre-btn').contains('ACTION').click()
      
      // Check if ACTION button is active
      cy.get('.genre-btn').contains('ACTION').should('have.class', 'active')
      
      // Wait for filtering
      cy.wait(500)
      
      // Check that only action movies are shown
      cy.get('.movie-card').each($card => {
        cy.wrap($card).find('.movie-genre').invoke('text').should('match', /action|adventure/i)
      })
    })
  
    it('should have working sort dropdown', () => {
      // Check sort dropdown
      cy.get('.sort-select').should('be.visible')
      
      // Check sort options
      cy.get('.sort-select option').should('contain.text', 'RELEASE DATE')
      cy.get('.sort-select option').should('contain.text', 'TITLE')
      cy.get('.sort-select option').should('contain.text', 'RATING')
    })
  
    it('should sort movies by title', () => {
      // Select sort by title
      cy.get('.sort-select').select('title')
      
      // Wait for sorting
      cy.wait(500)
      
      // Get movie titles and verify they're sorted
      cy.get('.movie-title').then($titles => {
        const titles = Array.from($titles).map(el => el.textContent)
        const sortedTitles = [...titles].sort()
        expect(titles).to.deep.equal(sortedTitles)
      })
    })
  
    it('should open movie details when card is clicked', () => {
      // Click on first movie card
      cy.get('.movie-card').first().click()
      
      // Check if movie detail modal opens
      cy.get('.movie-detail-overlay').should('be.visible')
      cy.get('.movie-detail-content').should('be.visible')
    })
  })