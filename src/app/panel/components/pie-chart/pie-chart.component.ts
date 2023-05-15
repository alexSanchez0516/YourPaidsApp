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
  public currentDate: Date = new Date();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() filterMonth: number =  -1;
  @Input() filterYear: number = this.currentDate.getFullYear();
  @Input() typeAmount: number = -1;

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
  private filterByMonth: boolean = false;

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


    if (this.filterByMonth && this.filterMonth > -1 && this.filterMonth != null && this.filterMonth != undefined) {
      this.amounts.entrances = [...this.amounts.entrances.filter((entrance) => {
        const newDate = new Date(entrance.create_at);
        return newDate.getMonth() == this.filterMonth;
      })];

      this.amounts.spents = [...this.amounts.spents.filter((spent) => {
        const newDate = new Date(spent.create_at);
        return newDate.getMonth() == this.filterMonth;
      })];
    }

    // Se trae las categorias de las entradas
    if (this.typeAmount == -1 || this.typeAmount == 1) {
      this.amounts.entrances.forEach((entrance) => {

        const categoryValues: sumAmountByCategory = {
          categoryName: '',
          amountValue: 0
        }
        categoryValues.categoryName = this.categories.entrances.find((category) => category.id === entrance.category)?.name || '';
        if (categoryValues.categoryName != '') {
          categoryValues.categoryName = `${categoryValues.categoryName} - ENTRADA`
        }
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
    }

    if (this.typeAmount == -1 || this.typeAmount == 0) {
      this.amounts.spents.forEach((spent) => {
        const categoryValues: sumAmountByCategory = {
          categoryName: '',
          amountValue: 0
        }
        categoryValues.categoryName = this.categories.spents.find((category) => category.id === spent.category)?.name || '';
        if (categoryValues.categoryName != '') {
          categoryValues.categoryName = `${categoryValues.categoryName} - GASTO`
        }
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
    }

    this.pieChartData = {
      labels: CategoriesEntrances.map((category) => category.categoryName).concat(CategoriesSpents.map((category) => category.categoryName)) ,
      datasets: [{
        data: CategoriesEntrances.map((category) => category.amountValue).concat(CategoriesSpents.map((category) => category.amountValue))
      }]
    };
  }


  /**
 *
 * @param changes
 */
  ngOnChanges(changes: SimpleChanges) {

    let isSendRequest = false;

    if (changes['filterYear'] && changes['filterYear'] !== undefined && changes['filterYear'] !== null) {
      this.filterYear = changes['filterYear'].currentValue;
      isSendRequest = true;
    }

    if (changes['typeAmount'] && changes['typeAmount'] !== undefined && changes['typeAmount'] !== null && changes['typeAmount'].currentValue != null) {
      this.typeAmount = changes['typeAmount'].currentValue;
      isSendRequest = true;
    }

    if (changes['filterMonth'] && changes['filterMonth'] !== undefined && changes['filterMonth'] !== null && changes['filterMonth'].currentValue != null) {
      isSendRequest = true;
      this.filterByMonth = true;
    }

    if (isSendRequest) {

      setTimeout(() => {

        this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.filterYear);
        this.setData();

      }, 1000)
    }
}
}
