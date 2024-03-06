import { TestBed } from '@angular/core/testing';
import { ReplaySubject, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createReadingListItem  } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { takeUntil } from 'rxjs/operators';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let unsubscribe$: Subject<void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    unsubscribe$ = new Subject<void>();
  });

  afterEach (()=>{
    unsubscribe$.next();
    unsubscribe$.complete();
  })

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('markBookAsFinished$', () => {
    it('should mark the book as finished when user clicks on button ', done => {
      actions = new ReplaySubject();
      const Item = createReadingListItem('A');
      const finishedDate = new Date().toISOString();
      actions.next(ReadingListActions.markBookAsFinished({ item: Item, finishedDate: finishedDate }));

      effects.markBookAsFinished$
      .subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.markBookAsFinished({ item: Item, finishedDate: finishedDate })
          );
        done();
      });

      httpMock.expectOne('/api/reading-list/A/finished').flush({ item: Item, finishedDate: finishedDate, type: '[Reading List API] Mark book as finished' })      
    });
  });
});
