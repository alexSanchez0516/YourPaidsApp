  export interface Section {
  name: string;
  updated: Date;
  }

  export interface Amount {
  _id?:  string;
  name: string;
  details?: string;
  user: string;
  quantity: number;
  img_url?: string;
  category: number;
  create_at: Date;
  update_at?: Date;
  paid: boolean;
  date_paid?: Date;
  recurrent?: boolean;
  createByRecurringService?: boolean;
  date_recurrent?: string;
  }


  export interface responseAllRecurringAmount {
    spentRecurring: Amount[];
    entranceRecurring: Amount[];
  }
  export interface SpentRecurringAmount {
    spents: Amount[];
  }

  export interface EntraceRecurringAmount {
    entrances: Amount[];
  }


  export interface PeriodicElement {
    _id?: string;
    position: number;
    type: string;
    category: string;
    quantity: number;
    porcent: number;
    create_at: Date;
    active: boolean;
  }

  export interface Control {
    _id?: string;
    quantity: number;
    user: string;
    category: number;
    create_at: Date;
    active: boolean;
    update_at?: Date;
    porcentWarning?: number;
    period: number;
  }

  export interface Period {
    id: number;
    name: string;
  }

  export interface ControlsResponse {
    controls: Control[];
  }

  export interface sumAmountByCategory {
    categoryName: string;
    amountValue: number;

  }

  export interface updateResponseControl {
    data: Control;
    status: string;
  }

  export interface updateResponseAmounts {
    data: Amount;
    status: string;
  }

  export interface ListMonthDashBoard {
    months: string[];
  }

  export interface listSpent {
    spents: Amount[];
  }

  export interface QuantitysAmountByMonth {
    spents: number[][];
    entrances: number[][];
  }

  export interface ListcalcByMonth {
    spents: number[];
    entrances: number[];
  }

  export interface simpleFilterDashboard {
  year: number;
  month: number;
  }


  export interface  ResponseAllAmounts {
  spents: Amount[];
  entrances: Amount[];
  }

  export interface  ResponseAllAmountsForMainGraphic {
  sumCurrentMonthSpent: number;
  sumCurrentMonthEntrances: number;
  sumBeforeMonthSpents: number;
  sumBeforeMonthEntrances: number;
  currentYearSpents: number
  currentYearEntrances: number
  }

  export interface Category {
  id: number;
  name: string;
  img_url: string;
  }


  export interface CategorysResponse {
  entrances: Category[];
  spents: Category[];
  }


  export interface FilterDates {
  data: DateFilter[]
  }

  export interface DateFilter {
  name: string;
  data: Date | number | string | boolean;
  }



