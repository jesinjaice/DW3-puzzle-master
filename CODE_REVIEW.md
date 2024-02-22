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

