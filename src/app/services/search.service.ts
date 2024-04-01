import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private showSearchBarSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showSearchBar$: Observable<boolean> = this.showSearchBarSubject.asObservable();

  constructor() { }

  toggleSearchBar() {
    this.showSearchBarSubject.next(!this.showSearchBarSubject.value);
  }


}
