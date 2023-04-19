import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {Amount, Category, CategorysResponse} from "../../interfaces/interfaces";
import {PanelService} from "../../services/panel.service";

@Component({
  selector: 'app-card-amount',
  templateUrl: './card-amount.component.html',
  styleUrls: ['./card-amount.component.css']
})
export class CardAmountComponent implements OnInit, OnChanges {

  @Input() amount: Amount;
  @Input() loading = true;

  @Input() type!: number; // 0 spent - 1 entrance
  public categories: CategorysResponse;


  constructor(private panelService: PanelService) {
    this.categories = {
      entrances: [], spents: []

    }
    this.amount = {
      category: 0,
      create_at: new Date(), name: "", paid: false, quantity: 0, user: ""
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      this.loading = changes['loading'].currentValue;
    }
  }

  findCategory(id: number) : Category {
    const category: Category = {
      id: 0, img_url: "", name: ""
    }
    return this.categories.entrances.find((category) => category.id == id) ||
      this.categories.spents.find((categorySpent) => categorySpent.id == id) || category ;
  }

  ngOnInit(): void {
    this.panelService.allCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (er) => {
          console.log('error: ', er);
        }
      })
  }

}
