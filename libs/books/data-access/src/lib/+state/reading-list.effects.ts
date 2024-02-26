import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap, switchMap } from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, add }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book, add })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, remove }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item, remove })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  showSnackBarOnAdd$=createEffect(() => 
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      concatMap((action) => {
        const typeItem:ReadingListItem = {
          ...action.book,
          bookId: action.book.id
        }
        if(action.add === false){
          return this.snackBar.open(
            `Added ${action.book.title} to reading list`,'Undo', { duration: 2000}
            ).onAction().pipe(map(() =>
            ReadingListActions.removeFromReadingList({ item:typeItem, remove:true })
            ))
        }
        else
        return [];
      })
    )
  );

  showSnackBarOnRemove$=createEffect(() => 
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      concatMap((action) => {
        const typeBook:Book = {
        id: action.item.bookId,
        ...action.item
      }
      if(action.remove === false){
        return this.snackBar.open(
          `Removed ${action.item.title} to reading list`,'Undo', { duration: 2000}
          ).onAction().pipe(map(() =>
          ReadingListActions.addToReadingList({ book:typeBook, add:true })
          ))
      } 
      else
        return [];
      })
    )
  )

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackBar: MatSnackBar, private readonly store: Store) { }
}
