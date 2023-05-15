import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AmountService} from "../../services/amount.service";
import {ResponseAllAmounts} from "../../interfaces/interfaces";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  indexSelected: number = 0;

  years: number[] = [];
  public amounts: ResponseAllAmounts;

  public yearOrMonth = 0; // year: 0, month: 1

  public numbersCalcSpents: Array<any> = [];
  public numbersCalcEntrances: Array<any> = [];
  public monthBar: string[] = [];

  public isLoading = true;
  months: string[] = [
    " ",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"]
  private currenDay: Date = new Date();

  private currentDay: Date = new Date();

  formFilter = this.fb.group({
    'month': [, [], []],
    'year': [this.currentDay.getFullYear(), [], []],
    'typeAmount' :[-1, [], []],
  })

  constructor(private fb: FormBuilder,
              private amountService: AmountService) {

    this.amounts = {
      entrances: [], spents: []

    }

    for (let i = this.currenDay.getFullYear() - 1; i > (this.currenDay.getFullYear() - 5); i--) {
      this.years.push(i);
    }
    this.years.push(this.currenDay.getFullYear());
  }

  filterData() {

  }

  ngOnInit(): void {

    this.amountService.getSpentsAndEntrances();

    setTimeout(() => {
      this.isLoading = false;
    }, 1000)
  }


}
