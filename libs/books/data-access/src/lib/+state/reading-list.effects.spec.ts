import { TestBed, fakeAsync } from '@angular/core/testing';
import { ReplaySubject, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore,MockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule,createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { takeUntil } from 'rxjs/operators';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let item: ReadingListItem;
  let book: Book;
  let snackbar: MatSnackBar;
  let store : MockStore;
  let unsubscribe$: Subject<void>;

  const bookItem = createReadingListItem('A');
  const itemBook = createBook('B');

  beforeAll(() => {
    item = createReadingListItem('A');      
    book = createBook('A');
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        { provide: MatSnackBar, useVale: {open: (param1, param2) => { return; }}},
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    actions = new ReplaySubject();
    store = TestBed.inject(MockStore);
    snackbar = TestBed.inject(MatSnackBar);
    unsubscribe$ = new Subject<void>();
  });

  afterEach (()=>{
    unsubscribe$.next();
    unsubscribe$.complete();
  })

  describe('loadReadingList$', () => {
    it('should fetch reading list', done => {
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.pipe(takeUntil(unsubscribe$))
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add a book to the reading list successfully', fakeAsync(() => {
      actions.next(ReadingListActions.addToReadingList({ book, add: false  }));

      effects.addBook$.pipe(takeUntil(unsubscribe$))
      .subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book, add: false })
        );
      })

      httpMock.expectOne('/api/reading-list').flush({});
    }));

    it('should undo the added book when API returns error', fakeAsync(() => {
      actions.next(ReadingListActions.addToReadingList({ book, add: false}));

      effects.addBook$.pipe(takeUntil(unsubscribe$))
      .subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book })
        );
      });

      httpMock.expectOne('/api/reading-list').flush({}, { status: 500, statusText: 'server error' });
    }));

    it('show snackbar on add book', async() => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedAddToReadingList({ book, add:false }));

      effects.addBook$.pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
        snackbar.open(`Added ${book.title} to reading list`,'Undo', { duration: 2000}).onAction().subscribe((action)=>{
          expect(action).toEqual(
            ReadingListActions.removeFromReadingList({ item:bookItem, remove:true }))
        })
      });
    });
  }); 

  describe('removeBook$', () => {
    it('should remove book successfully from reading list', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item, remove: false }));

      effects.removeBook$.pipe(takeUntil(unsubscribe$))
      .subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({ item, remove: false  })
        );
        done();
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({});
    });

    it('should undo removed book when API returns error', fakeAsync(() => {
      actions.next(ReadingListActions.removeFromReadingList({ item, remove: false  }));

      effects.removeBook$.pipe(takeUntil(unsubscribe$))
      .subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({}, { status: 500, statusText: 'server error' });
    }));

    it('show snackbar on remove book', async() => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item, remove:false }));

      effects.removeBook$.pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
        snackbar.open(`Removed ${item.title} to reading list`,'Undo', { duration: 2000}).onAction().subscribe((action)=>{
          expect(action).toEqual(
            ReadingListActions.addToReadingList({ book:itemBook, add:true })
          );
        })
      });
    });
  });

});
