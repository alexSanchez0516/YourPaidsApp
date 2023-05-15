import {Component, OnInit} from '@angular/core';
import {BalanceService} from "../../services/balance.service";
import {Amount} from "../../interfaces/interfaces";
import {EntranceService} from "../../services/entrance.service";
import {SpentService} from "../../services/spent.service";
import { RecurringAmountsService } from '../../services/recurring-amounts.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  public balance: number = 0;
  public entrances: Amount[] = [];
  public spents: Amount[] = [];
  public balanceMonth = 0;
  public movements: any;
  public allBalancePaids = true;
  public entrancesLimit: Amount[] = [];
  public spentsLimit: Amount[] = [];
  public currency = localStorage.getItem('currency');
  constructor(private balanceService: BalanceService,
              private entranceService: EntranceService,
              private spentService: SpentService,
              private recurringService: RecurringAmountsService
              ) {

  }

  ngOnInit(): void {


    this.recurringService.getAmountsRecurring();

    let idUser = localStorage.getItem('uid') || '';

    this.entranceService.allByUser(idUser).subscribe({
      next: (entrances) => {
        // @ts-ignore
        this.entrances = [...entrances.entrances];
        this.spentService.allByUser(idUser).subscribe({
          next: (spents) => {
            // @ts-ignore
            this.spents = [...spents.spents];

            this.calcBalance();
            // this.balanceService.getBalance(this.spents, this.entrances);
            // this.balance = this.balanceService.balance;
            // this.balanceMonth = this.balanceService.balance_month;
            // this.balanceService.filterForLatDayNumber(7);
            // this.spentsLimit = this.balanceService.spentsLimit;
            // this.entrancesLimit = this.balanceService.entrancesLimit;
          }
        })
      }
    })
  }

  calcBalance() {
    if (this.allBalancePaids) {
      console.log('Calculating');
      const spents: Amount[] = this.spents.filter(spent => spent.paid);
      const entrances: Amount[] = this.entrances.filter(entrance => entrance.paid);
      this.balanceService.getBalance(spents, entrances);
    } else {
      this.balanceService.getBalance(this.spents, this.entrances);
    }
    this.balance = this.balanceService.balance;
    this.balanceMonth = this.balanceService.balance_month;
    this.balanceService.filterForLatDayNumber(7);
    this.spentsLimit = this.balanceService.spentsLimit;
    this.entrancesLimit = this.balanceService.entrancesLimit;
  }

  accountForEverything() {
    if (this.allBalancePaids) {
      this.allBalancePaids = false;
    } else {
      this.allBalancePaids = true;
    }
    this.calcBalance();
  }
}
