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

  }


  export interface sumAmountByCategory {
    categoryName: string;
    amountValue: number;

  }

  export interface ListMonthDashBoard {
    months: string[];
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



