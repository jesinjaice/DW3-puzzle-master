// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      startAt: typeof startAt;
      searchBooks: typeof searchBooks;
      addToReadingList: typeof addToReadingList;
      removeFromReadingList: typeof removeFromReadingList;
      readingListItem: typeof readingListItem;
      undoAction: typeof undoAction;
    }
  }
}

export function startAt(url) {
  cy.visit(url);
  cy.get('tmo-root').should('contain.text', 'okreads');
}

export function searchBooks(book: string) {
  cy.get('input[type="search"]').type('javascript');
  cy.get('form').submit();
}

export function addToReadingList() {
  cy.get('[data-testing="add-book-button"]:enabled').first().should('exist').click();
}

export function removeFromReadingList() {
  cy.get('[data-testing="remove-book-button"]:enabled').last().should('exist').click();
}

export function readingListItem() {
  return cy.get('tmo-total-count [ng-reflect-content]').invoke('attr', 'ng-reflect-content');
}

export function undoAction() {
  cy.get('.mat-simple-snackbar-action').last().should('exist').click();
}

Cypress.Commands.add('startAt', startAt);
Cypress.Commands.add('searchBooks', searchBooks);
Cypress.Commands.add('addToReadingList', addToReadingList);
Cypress.Commands.add('removeFromReadingList', removeFromReadingList);
Cypress.Commands.add('readingListItem', readingListItem);
Cypress.Commands.add('undoAction', undoAction);