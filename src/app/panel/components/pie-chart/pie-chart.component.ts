import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PanelService } from "../../services/panel.service";
import { AmountService } from "../../services/amount.service";

import {
  Amount,
  CategorysResponse,ResponseAllAmounts, sumAmountByCategory
} from "../../interfaces/interfaces";
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public currentDate: Date = new Date();

  @Input() filterMonth: number =  -1;
  @Input() filterYear: number = this.currentDate.getFullYear();

  // Pie
  // @ts-ignore
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  public categories: CategorysResponse;

  public amounts: ResponseAllAmounts;

  public pieChartType: ChartType = 'pie';

  public pieChartData!: ChartData<'pie', number[], string | string[]>;

  constructor(private panelService: PanelService, private amountService: AmountService) {

    this.amounts = {
      entrances: [], spents: []

    }
    this.categories = {
      entrances: [],
      spents: []
    }
  }

  ngOnInit() {
    this.panelService.allCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (er) => {
          console.log('error: ', er);
        }
      })


    setTimeout(() => {
      this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.filterYear);
      this.setData();
    }, 1000);

  }

  private setData() {

    const CategoriesEntrances: sumAmountByCategory[] = [];
    const CategoriesSpents: sumAmountByCategory[] = [];

    // Se trae las categorias de las entradas
    this.amounts.entrances.forEach((entrance) => {
      const categoryValues: sumAmountByCategory = {
        categoryName: '',
        amountValue: 0
      }
      categoryValues.categoryName = this.categories.entrances.find((category) => category.id === entrance.category)?.name || '';
      categoryValues.amountValue = entrance.quantity;

      // * Si se encuentra esa categoria entonces solo sumamos importes
      const existCategory = CategoriesEntrances.find((entranceCategory) => entranceCategory.categoryName === categoryValues.categoryName);
      if (existCategory) {
        existCategory.amountValue += entrance.quantity;
        const index = CategoriesEntrances.findIndex((entranceCategory) => entranceCategory.categoryName === categoryValues.categoryName);
        CategoriesEntrances.splice(index, 1, existCategory);
      } else {

        // * En caso contrario añadimos el objeto inicial --> categoryValues
        if (categoryValues.categoryName != '') {
          CategoriesEntrances.push(categoryValues);
        }
      }
    });

    this.amounts.spents.forEach((spent) => {
      const categoryValues: sumAmountByCategory = {
        categoryName: '',
        amountValue: 0
      }
      categoryValues.categoryName = this.categories.spents.find((category) => category.id === spent.category)?.name || '';
      categoryValues.amountValue = spent.quantity;

      // * Si se encuentra esa categoria entonces solo sumamos importes
      const existCategory = CategoriesSpents.find((spentCategory) => spentCategory.categoryName === categoryValues.categoryName);
      if (existCategory) {
        existCategory.amountValue += spent.quantity;
        const index = CategoriesSpents.findIndex((spentCategory) => spentCategory.categoryName === categoryValues.categoryName);
        CategoriesSpents.splice(index, 1, existCategory);
      } else {

        // * En caso contrario añadimos el objeto inicial --> categoryValues
        if (categoryValues.categoryName != '') {
          CategoriesSpents.push(categoryValues);
        }
      }
    });


    this.pieChartData = {
      labels: CategoriesEntrances.map((category) => category.categoryName).concat(CategoriesSpents.map((category) => category.categoryName)) ,
      datasets: [{
        data: CategoriesEntrances.map((category) => category.amountValue).concat(CategoriesSpents.map((category) => category.amountValue))
      }]
    };
  }

  // TODO: Mover lógica aqui, para reutilizar y no tener ese codigo casi duplicado
  private calcDateFromCategory(amount: Amount) {

  }


  /**
 *
 * @param changes
 */
  ngOnChanges(changes: SimpleChanges) {

  if (changes['filterYear'] && changes['filterYear'] !== undefined && changes['filterYear'] !== null) {
    this.filterYear = changes['filterYear'].currentValue;


    // this.chart?.update();


    setTimeout(() => {

      this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.filterYear);
      this.setData();

    }, 1000)
  }
}
}
