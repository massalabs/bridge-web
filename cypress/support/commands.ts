/// <reference types="cypress" />
import '@synthetixio/synpress/support';

declare global {
  namespace Cypress {
    interface Chainable {
      acceptMetaMaskAccess: () => void;
    }
  }
}

Cypress.Commands.add('acceptMetaMaskAccess', () => {
  cy.acceptMetamaskAccess({ switchNetwork: true });
});
