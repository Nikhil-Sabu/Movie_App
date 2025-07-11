// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style')
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }'
  style.setAttribute('data-hide-command-log-request', '')
  app.document.head.appendChild(style)
}

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  return true
})

// Add custom commands for better error handling
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})