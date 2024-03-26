import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Observable, Subscription } from 'rxjs';
import { Card } from '../../interfaces/card.interface';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['market', 'price'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource:any = new MatTableDataSource<any>([]);
  id!: string;
  card$! : Observable<Card>;
  sort!: MatSort;
  private subscription!: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cardService: CardService, private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }
  
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.card$ = this.cardService.getCardById(this.id);
    this.subscription = this.card$.subscribe((card: Card) => {
      const price = card.card_prices[0];
      const prices = [
        {
          market: 'Card Market',
          price: price.cardmarket_price
        }, {
          market: 'TCG Player',
          price: price.tcgplayer_price
        }, {
          market: 'Ebay',
          price: price.ebay_price
        }, {
          market: 'Amazon',
          price: price.amazon_price
        }, {
          market: 'Cool Stuff Inc',
          price: price.coolstuffinc_price
        }
      ];
      this.dataSource.data = prices;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goToList(){
    this.router.navigate(['']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}