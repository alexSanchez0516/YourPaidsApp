import {Component, OnInit} from '@angular/core';
import {AmountService} from "../../services/amount.service";
import {
  CategorysResponse,
  DateFilter,
  FilterDates,
  ResponseAllAmounts
} from "../../interfaces/interfaces";
import {FormBuilder} from "@angular/forms";
import {PanelService} from "../../services/panel.service";

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  public amounts: ResponseAllAmounts;
  public categories!: CategorysResponse;
  public stateIndexAmount!: number;
  public notResult = false;
  private currenDay: Date = new Date();

  formFilter = this.fb.group({
    'paid': [null, [], []],
    'category': [null, [], []],
    'month': [null, [], []],
    'year': [this.currenDay.getFullYear(), [], []]
  })
  months: String[] = [
    "",
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

  public isLoading = true;
  years: number[] = [];

  constructor(private amountService: AmountService,
              private fb: FormBuilder,
              private panelService: PanelService) {

    this.amounts = {
      entrances: [], spents: []

    }
    this.categories = {
      entrances: [],
      spents: []
    }

    this.stateIndexAmount = 0;
    for (let i = this.currenDay.getFullYear() - 1; i > (this.currenDay.getFullYear() - 5); i--) {
      this.years.push(i);
    }
    this.years.push(this.currenDay.getFullYear());
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

    this.amountService.getSpentsAndEntrances();
    setTimeout(() => {

      if (this.formFilter.controls.month.value == null) {
        this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.currenDay.getFullYear());
      } else {
        this.amounts = this.amountService
        .getSpentsAndEntrancesByMonth(this.currenDay.getMonth(),
          this.currenDay.getFullYear());
      }
     
      this.isLoading = false
    }, 1000)

  }

  filter() {

    

    const filterDates: FilterDates = {
      data: []
    }

    // Se envía el mes
    if (!this.formFilter.controls.month.pristine ||
      this.formFilter.controls.month.value != null) {
        
        const monthFilter: DateFilter = {
          name: 'month',
          data: this.formFilter.controls.month.value || this.currenDay.getMonth()
        }
        filterDates.data.push(monthFilter);
        console.log(filterDates);
    }

    // Se envía la categoría
    if (this.formFilter.controls.category.value != null) {
      if (this.formFilter.controls.category.value) {
        const categoryFilter: DateFilter = {
          name: 'category',
          data: this.formFilter.controls.category.value
        }
        filterDates.data.push(categoryFilter);
      }
    }

    // Se envía el estado
    if (this.formFilter.controls.paid.value != null) {
      filterDates.data.push({
        name: 'paid',
        data: this.formFilter.controls.paid.value || false
      })
    }

    this.search(filterDates);
    this.notResult = this.amounts.spents.length == 0
      && this.amounts.entrances.length == 0;

    console.log(this.amounts);

  }

  /**
   *
   * @param filterDates
   */
  search(filterDates: FilterDates) {
    console.log('se llama');

    this.amounts = this.amountService.getSpentsAndEntrancesByYear(this.formFilter.controls.year.value || this.currenDay.getFullYear());

    // filter for month and year
    const monthFilter = filterDates.data.find((filter) => filter.name == 'month')
    if (this.formFilter.controls.month.value != undefined) {
      this.amounts = this.amountService
        .getSpentsAndEntrancesByMonth(this.formFilter.controls.month.value
        || new Date().getMonth(), this.formFilter.controls.year.value
          || this.currenDay.getFullYear())
    }

    // Search for state paid
    const paid = filterDates.data.find((filter) => filter.name == 'paid')
    if (paid != undefined) {
      this.amounts = this.amountService
        .GetSpentAndEntrancesByStatePaid(this.amounts,
          this.formFilter.controls.paid.value || false,
        this.formFilter.controls.year.value || this.currenDay.getFullYear());
    }

    // Search for category
    const category = filterDates.data.find((filter) => filter.name == 'category')
    if (category != undefined) {
      this.amounts = this.amountService
        .GerSpentAndEntrancesByCategory(this.amounts,
          this.formFilter.controls.category.value || -1,
        this.formFilter.controls.year.value || this.currenDay.getFullYear());
    }
  }

  changeSelectedTypeAmount(index: number) {
    this.stateIndexAmount = index;
  }
}
