import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Card } from '../interfaces/card.interface';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  private _search = new BehaviorSubject<{ term: string, offset: number }>({ term: '', offset: 0 });
  public readonly search$ = this._search.asObservable();

  constructor(private http: HttpClient) { 

  }

  getCards(name: string | null, offset = 0): Observable<Card[]>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      num : 100,
      offset,
    }
    if (name) params.fname = name;
    return this.http.get<ApiResponse>(this.API_URL, {params}).pipe(
      map( (resp: ApiResponse) => resp.data),
      catchError(error => {
        // Ignore 400 errors
        if (error.status === 400) {
          return of([]);
        }
        // Re-throw other errors
        return throwError(() => error);
      })
    );
  }

  setSearch(term: string, offset: number) {
    this._search.next({ term, offset });
  }

  getCardById(id: string): Observable<Card>{
    const params = {
      id,
  }
    return this.http.get<ApiResponse>(this.API_URL, {params}).pipe(
      map( (res: ApiResponse) => res.data[0]));
  }
}
