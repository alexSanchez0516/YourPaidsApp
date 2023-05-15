import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,} from '@angular/core';
import {Amount, Category, CategorysResponse} from "../../interfaces/interfaces";
import {PanelService} from "../../services/panel.service";
import { EntranceService } from '../../services/entrance.service';
import { SpentService } from '../../services/spent.service';
import {alertError, alertSuccessTimerShowHide} from "../../../utils/alerts";
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';


@Component({
  selector: 'app-card-amount',
  templateUrl: './card-amount.component.html',
  styleUrls: ['./card-amount.component.css']
})
export class CardAmountComponent implements OnInit, OnChanges {

  @Input() amount: Amount;
  @Input() loading = true;
  @Input() type: number; // 0 spent - 1 entrance
  @Output() idAmount: EventEmitter<string> = new EventEmitter;
  @Output() typeAmount: EventEmitter<string> = new EventEmitter;

  public categories: CategorysResponse;
  public isDelete = false;
  public currency = localStorage.getItem('currency');
  constructor(private panelService: PanelService,
    private entranceService: EntranceService,
    private spentService: SpentService,
    private firebaseStorageService: FirebaseStorageService) {
    this.categories = {
      entrances: [], spents: []

    }
    this.type = 0;
    this.amount = {
      category: 0,
      create_at: new Date(), name: "", paid: false, quantity: 0, user: ""
    }
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      this.loading = changes['loading'].currentValue;
    }

  }

  public deleteCard(id: string) {
    if (this.type == 0) {

      this.spentService.delete(id).subscribe({
        next: (spentDeleteResponse) => {
          if (spentDeleteResponse.status == 'success') {

            try {
              this.firebaseStorageService.delete(spentDeleteResponse.data.img_url!);
            } catch (error) {
              alertError(`Error deleting ${spentDeleteResponse.data.img_url} firebase storage, error: ${error}`);
            }
            alertSuccessTimerShowHide("Eliminado correctamente");
            this.idAmount.emit(id);
            this.typeAmount.emit('0');
          }
        },
        error: (e) => {
          alertError(`error: ${e.message}`);
        }
      });

    } else if (this.type == 1) {

      this.entranceService.delete(id).subscribe({
        next: (entranceDeleteResponse) => {
          if (entranceDeleteResponse.status == 'success') {
            this.firebaseStorageService.delete(entranceDeleteResponse.data.img_url!);

            alertSuccessTimerShowHide("Eliminado correctamente");
            this.idAmount.emit(id);
            this.typeAmount.emit('1');
          }
        },
        error: (e) => {
          alertError(`error: ${e.message}`);
        }
      });
    }

  }


  findCategory(id: number) : Category {
    const category: Category = {
      id: 0, img_url: "", name: ""
    }
    return this.categories.entrances.find((category) => category.id == id) ||
      this.categories.spents.find((categorySpent) => categorySpent.id == id) || category ;
  }

}

