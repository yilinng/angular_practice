import { NgFor, AsyncPipe, JsonPipe } from "@angular/common";
import { InjectionToken, Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

//https://dev.to/this-is-angular/stop-being-scared-of-injectiontokens-2406
export interface Search<T> {
  search: (search: string) => T[];
}

export const SEARCH = new InjectionToken<Search<object>>('search');

@Component({
  selector: 'shareable',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, AsyncPipe, JsonPipe],
  template: `
    <input type="text" [formControl]="searchInput" />
    <button (click)="search()">search</button>
    <div *ngFor="let d of data | async">{{ d | json }}</div>
  `,
})
export class ShareableComponent {

  searchService = inject(SEARCH, { optional: true });
  //https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject
  data = new BehaviorSubject<object[]>([]);

  searchInput = new FormControl('', { nonNullable: true });

  // We are not injecting `searchService` with the constructor, 
  // because `inject` function infers the type. 
  constructor() {
    if (!this.searchService)
      throw new Error(`SEARCH TOKEN must be PROVIDED`);
  }

  //https://bobbyhadz.com/blog/typescript-object-is-possibly-null
  search() {
    if (this.searchService != null) {
      this.data.next(this.searchService.search(this.searchInput.value));
    }
  }
}