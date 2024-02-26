describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to mark a book as finished', () => { 
    cy.searchBook('ngrx');
    
    cy.get('[data-testing="add-book-button"]:enabled').first().should('exist').click();
 
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('.reading-list-item').last().find('.mark-finish-circle').should('exist').click();
    cy.get('.reading-list-item').last().should('contain.text', 'Finished on');

    cy.get('[data-testing="remove-book-button"]:enabled').last().should('exist').click();

    cy.get('[data-testing="close-reading-list"]').click();

    cy.get('[data-testing="add-book-button"]:enabled').first().should('exist').click();

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('.reading-list-item').last().find('.mark-finish-circle').should('exist');

  });
});
