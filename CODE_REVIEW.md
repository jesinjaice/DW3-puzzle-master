**Code Smells and Improvements**

1. The naming convention of variables below files are not proper. Fixed the naming conventions.
    `book-search.component.html`
    `book-search.component.ts`
    `reading-list.component.html`
2.  Used ngSubmit instead of submit. In `book-search.component.html`, `submit` event added for searchForm is replaced by `ngSubmit`.
3.  In file `book-search.component.html`, the template contains a date function to change the format of the date. Instead of using a    function, we can use an angular date pipe to change the format.
4. To prevent memory leak we can use async pipe instead of subscription, for retreiving books. By adding '| async' pipes the subscriptions are handled automatically so there is no need to unsubscirbe manually.
5. In file `total-count.component.ts`, we can remove the ngOnit() lifecycle since it is not utilized
6. In file `book-search.component.html`, for proper accessibility, buttons should be represented with a <button> tag rather than an anchor tag with a (click) listener. Changed it to button (Line 51)

**Accessibility**

**Automated Lighthouse Scan Issues**

1. Buttons do not have an accessible name
2. Background and foreground colors do not have a sufficient contrast ratio.


**Manual Checks**

1. Added alt-text for book-covers image. Gave it as 'book cover' instead of the book title.
2. `Javascript` is wrapped in an anchor tag in `book-search.component.html` . Changed it to a button element.
3. Added `aria-label` for necassary buttons to make it readable.
4. Added darker effects for `reading list` and and `want to read` so that it will provide hover effect to the buttons.
5. The buttons can be made visually focusable and accessible. The closing button of reading list in `app.component.html` is made focusable by adding outline in `app.component.scss`.
