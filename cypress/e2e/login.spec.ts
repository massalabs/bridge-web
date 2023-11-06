describe('Bridge | Connect | MestaMask | Connect', () => {
  afterEach(() => {
    cy.disconnectMetamaskWalletFromDapp();
  });
  it('it should connect with MM and switch the network automatically', () => {
    cy.visit('http://localhost:8080');

    cy.get('[data-testid="connect-wallet-button"]').click();

    cy.get('[ data-testid="connect-metamask-button"]').click();

    cy.get('div').contains('MetaMask').click();

    cy.acceptMetamaskAccess({ switchNetwork: true }).should('be.true');
    cy.get('[data-testid="tag"]').contains('Connected');
  });

  it('should change to sepolia network and connect', () => {
    cy.visit('http://localhost:8080');
    cy.changeMetamaskNetwork('sepolia');

    cy.get('[data-testid="connect-wallet-button"]')
      .contains('Connect wallets')
      .click();

    cy.get('[ data-testid="connect-metamask-button"]').click();

    cy.get('div').contains('MetaMask').click();

    cy.acceptMetamaskAccess().should('be.true');
    cy.get('[data-testid="tag"]').contains('Connected');
  });
});
