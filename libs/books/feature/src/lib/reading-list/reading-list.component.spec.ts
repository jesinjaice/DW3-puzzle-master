import { async, ComponentFixture, TestBed,fakeAsync } from '@angular/core/testing';
import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;
  const initialState = {
    books: {
      ids: [],
      entities: {},
      loaded: false
    },
    readingList: {
      ids: [],
      entities: {},
      loaded: true,
      error: null
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers:[ provideMockStore({ initialState })]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('markBookAsFinished()', () => {
    it('should dispatch markBookAsFinished action when user completes reading', () => {
      const item = createReadingListItem('A');
      const finishedDate = new Date().toISOString();
      component.markBookAsFinished(item);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: "[Reading List API] Mark book as finished",
        item,
        finishedDate
      });
    });
  });
});
