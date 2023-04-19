import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AmountService } from "../../services/amount.service";
import {
  ListMonthDashBoard, ResponseAllAmounts,
  QuantitysAmountByMonth, ListcalcByMonth
} from "../../interfaces/interfaces";
import { PanelService } from "../../services/panel.service";

import * as moment from 'moment';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnChanges, OnInit {


  public currentDate: Date = new Date();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() filterMonth: number = -1;
  @Input() filterYear: number = this.currentDate.getFullYear();

  public amounts: ResponseAllAmounts;
  public isLoading: boolean = true;
  public calcByMonth: ListcalcByMonth;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public ListMonthDashBoard: ListMonthDashBoard = {
    months: []
  };
  public QuantitysAmountByMonth: QuantitysAmountByMonth = {
    entrances: [],
    spents: []
  }
  public barChartData!: ChartData<'bar'>;

  /**
   *
   * @param amountService
   * @param panelService
   */
  constructor(private amountService: AmountService, private panelService: PanelService) {

    this.amounts = {
      entrances: [], spents: []

    }

    this.calcByMonth = {
      spents: [],
      entrances: [],
    };

    for (let i = 0; i <= this.currentDate.getMonth(); i++) {
      this.ListMonthDashBoard.months.push(moment().locale('es').month(i).format("MMMM"));
    }
  }


  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {

    if (changes['filterYear'] && changes['filterYear'] !== undefined && changes['filterYear'] !== null) {
      this.filterYear = changes['filterYear'].currentValue;

      let months:number =  this.filterYear < this.currentDate.getFullYear() ? 11 : this.currentDate.getMonth();

      this.ListMonthDashBoard.months = [];

        for (let i = 0; i <= months; i++) {
          this.ListMonthDashBoard.months.push(moment().locale('es').month(i).format("MMMM"));
        }

      this.reloadPageByYear();
      this.chart?.update();
    }
  }

  /**
  * Maps quantitys amount by month
  */
  private mapQuantitysAmountByMonth() {
    let months: number = this.currentDate.getMonth();


    if (this.filterYear < this.currentDate.getFullYear()) {
      months = 11;
    }

    for (let i = 0; i <= months; i++) {

      this.QuantitysAmountByMonth.entrances[i] = [];
      this.QuantitysAmountByMonth.spents[i] = [];

      this.amounts.spents.forEach((spent) => {
        const dateAmount = new Date(spent.create_at);
        if (dateAmount.getMonth() == i && dateAmount.getFullYear() == this.filterYear) {
          this.QuantitysAmountByMonth.spents[i].push(spent.quantity);
        }
      });

      this.amounts.entrances.forEach((entrance) => {
        const dateAmount = new Date(entrance.create_at);
        if (dateAmount.getMonth() == i && dateAmount.getFullYear() == this.filterYear) {
          this.QuantitysAmountByMonth.entrances[i].push(entrance.quantity);
        }
      });

    }
  }

  ngOnInit(): void {
    this.reloadPageByYear();
  }


  /**
   *
   */
  private reloadPageByYear() {
    // this.calcByMonth.entrances = [];
    // this.calcByMonth.spents = [];

    setTimeout(() => {

      this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.filterYear);
      this.mapQuantitysAmountByMonth();

      for (let index = 0; index < this.QuantitysAmountByMonth.entrances.length; index++) {
        this.calcByMonth.entrances[index] = this.QuantitysAmountByMonth.entrances[index].reduce((a, b) => a + b, 0);
      }

      for (let index = 0; index < this.QuantitysAmountByMonth.spents.length; index++) {
        this.calcByMonth.spents[index] = this.QuantitysAmountByMonth.spents[index].reduce((a, b) => a + b, 0);
      }
      console.log(this.calcByMonth.spents);
      console.log(this.calcByMonth.entrances);



      this.barChartData = {
        labels: this.ListMonthDashBoard.months,
        datasets: [
          { data: this.calcByMonth.spents, label: 'Gastos' },
          { data: this.calcByMonth.entrances, label: 'Ingresos' },

        ]
      };

      this.isLoading = false
    }, 1000)
  }

}
