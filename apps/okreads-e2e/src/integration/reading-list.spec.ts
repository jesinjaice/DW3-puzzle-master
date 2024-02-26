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

  it('Then: I should be able to add an item to list and then undo the same', () => {
    cy.searchBooks('javascript');

    cy.addToReadingList();
   
    cy.readingListItem().then(initialItemCount => {
      cy.addToReadingList();
      cy.undoAction();
      cy.readingListItem().then(finalItemCount => {
        expect(initialItemCount).to.equal(finalItemCount);
      });
    });
  });

  it('Then:  I should be able to remove an item from list and then undo the same', () => {
    cy.searchBooks('javascript');
    cy.addToReadingList();

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.readingListItem().then(initialItemCount => {
      cy.removeFromReadingList();
      cy.undoAction();
      cy.readingListItem().then(finalItemCount => {
        expect(initialItemCount).to.equal(finalItemCount);
      });
    });
  });
});
