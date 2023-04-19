import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {AmountService} from "../../services/amount.service";
import {ResponseAllAmounts} from "../../interfaces/interfaces";
import * as moment from 'moment';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges, OnInit{

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public barChartData: ChartData<'bar'> = {
    labels: [moment().locale('es').month(new Date().getMonth()-1).format("MMMM"),
      'Actual',
      String(new Date().getFullYear())],
    datasets: [
      { data: [], label: 'Gastos' },
      { data: [], label: 'Ingresos' },

    ]
  };


  public monthSelected: number;



  constructor(private amountService: AmountService) {
    this.monthSelected = new Date().getMonth();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
//    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit(): void {
    this.amountService.getSpentsAndEntrances();
    setTimeout(() => {

      let totalSpentCurrentMonth = 0;
      let totalSpentBeforeMonth = 0;
      let totalSpentByYear = 0;
      let totalEntranceCurrentMonth = 0;
      let totalEntranceBeforeMonth = 0;
      let totalEntranceByYear = 0;

      let year = moment().locale('es').year();
      const beforeMonth = parseInt(moment().month(new Date().getMonth()-1).format("M"));


      const responseCurrentMonth: ResponseAllAmounts = this.amountService.getSpentsAndEntrancesByMonth(this.monthSelected, year);
      responseCurrentMonth.spents.forEach((spent) => totalSpentCurrentMonth += spent.quantity);
      responseCurrentMonth.entrances.forEach((entrance) => totalEntranceCurrentMonth += entrance.quantity);


      if (new Date().getMonth() == 0) {
        year--;
      }

      const responseBeforeMonth: ResponseAllAmounts = this.amountService.getSpentsAndEntrancesByMonth(beforeMonth, year);
      responseBeforeMonth.spents.forEach((spent) => totalSpentBeforeMonth += spent.quantity);
      responseBeforeMonth.entrances.forEach((entrance) => totalEntranceBeforeMonth += entrance.quantity);


      const responseCurrentYear: ResponseAllAmounts = this.amountService.getSpentsAndEntrancesByYear(new Date().getFullYear());
      responseCurrentYear.spents.forEach((spent) => totalSpentByYear += spent.quantity);
      responseCurrentYear.entrances.forEach((entrance) => totalEntranceByYear += entrance.quantity);


      this.barChartData.datasets[0].data.push(totalSpentBeforeMonth);
      this.barChartData.datasets[1].data.push(totalEntranceBeforeMonth);

      this.barChartData.datasets[0].data.push(totalSpentCurrentMonth);
      this.barChartData.datasets[1].data.push(totalEntranceCurrentMonth);

      this.barChartData.datasets[0].data.push(totalSpentByYear);
      this.barChartData.datasets[1].data.push(totalEntranceByYear);

      this.chart?.update();
    },1000);

  }

}
