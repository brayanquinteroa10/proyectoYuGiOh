import { Component, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card } from '../../interfaces/card.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  currentSearch: string | null = null;

  formControl = new FormControl('');

  cards : Card[] = [];

  offset = 0;

  constructor(private cardService: CardService) { }

  ngOnInit(): void {
    this.cardService.search$.subscribe(searchState => {
      this.currentSearch = searchState.term;
      this.offset = searchState.offset;
      this.formControl.setValue(this.currentSearch || '');
      this.searchCards(this.currentSearch);
    });

    this.formControl.valueChanges.
    pipe(
      debounceTime(700),
      distinctUntilChanged(),
    ).
    subscribe(value => {
      this.cards = [];
      this.currentSearch = value;
      this.cardService.setSearch(this.currentSearch || '', this.offset);
      this.searchCards(this.currentSearch);
    });
    this.searchCards();
  }

  onScroll(){
    this.offset += 100;
    this.searchCards(this.currentSearch);
  }

  searchCards(cardName: string | null = null){
    this.cardService.getCards(cardName, this.offset).subscribe(cards => {
      this.cards = [...this.cards, ...cards];
    });
  }
}
