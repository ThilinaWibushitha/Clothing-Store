// cypress/e2e/performance.cy.js - Performance testing
describe('Performance Tests', () => {
  beforeEach(() => {
    cy.visit('/velvetVogue.html')
  })

  it('should load within acceptable time', () => {
    cy.visit('/velvetVogue.html', {
      onBeforeLoad: (win) => {
        win.performance.mark('page-start')
      },
      onLoad: (win) => {
        win.performance.mark('page-end')
        win.performance.measure('page-load', 'page-start', 'page-end')
      }
    })
    
    cy.window().then((win) => {
      const measure = win.performance.getEntriesByName('page-load')[0]
      expect(measure.duration).to.be.lessThan(3000) // 3 seconds
    })
  })

  it('should have optimized images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'loading')
    })
  })

  it('should have proper meta tags for SEO', () => {
    cy.get('meta[name="description"]').should('exist')
    cy.get('meta[name="keywords"]').should('exist')
    cy.get('title').should('not.be.empty')
  })

  it('should have structured data', () => {
    cy.get('script[type="application/ld+json"]').should('exist')
  })

  it('should load critical CSS first', () => {
    cy.get('link[rel="stylesheet"]').should('exist')
  })
})
