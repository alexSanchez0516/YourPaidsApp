import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Amount, ResponseAllAmounts} from "../interfaces/interfaces";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AmountService {
  get spents(): Amount[] {
    return this._spents;
  }

  set spents(value: Amount[]) {
    this._spents = value;
  }

  get entrances(): Amount[] {
    return this._entrances;
  }

  set entrances(value: Amount[]) {
    this._entrances = value;
  }

  private _spents: Amount[] = [];
  private _entrances: Amount[] = [];
  private current: Date = new Date();

  constructor(private http: HttpClient,
) {
  }

  /**
   *
   */
  public getSpentsAndEntrances() {

    let idUser = localStorage.getItem('uid') || '';
    let url = `${environment.endpoint}/app/all-amounts/${idUser}`;
    console.log(url);
    this.http.get<ResponseAllAmounts>(url).subscribe({
      next: (amount) => {
        this._spents = [...amount.spents];
        this._entrances = [...amount.entrances];
      }
    })
  }

  /**
   *
   * @param month
   * @param year
   */
    getSpentsAndEntrancesByMonth(month: number, year: number): ResponseAllAmounts{
      if (year == undefined) {
        year = this.current.getFullYear();
      }

      if (month > 0) {
        month--;
      }

      const response: ResponseAllAmounts = {
        entrances:[],
        spents: []
      }
      response.entrances = [ ...this.entrances.filter((entrance) => {
        const dateAmount = new Date(entrance.create_at);
        return dateAmount.getMonth() === month &&
          dateAmount.getFullYear() === year;
      })];

      response.spents = [ ...this.spents.filter((spent) => {
        const dateAmount = new Date(spent.create_at);
        return dateAmount.getMonth() === month &&
          dateAmount.getFullYear() === year;
      })];

      return response;
  }

  /**
   *
   * @param year
   */
  getSpentsAndEntrancesByYear(year: number) :ResponseAllAmounts{
    const response: ResponseAllAmounts = {
      entrances:[],
      spents: []
    }
    response.entrances = [ ...this.entrances.filter((entrance) => {
      const dateAmount = new Date(entrance.create_at);
      return dateAmount.getFullYear() === year;
    })];

    response.spents = [ ...this.spents.filter((spent) => {
      const dateAmount = new Date(spent.create_at);
      return dateAmount.getFullYear() === year;
    })];

    return response;
  }

  /**
   *
   * @param amounts
   * @param paid
   * @param year
   * @constructor
   */
  GetSpentAndEntrancesByStatePaid(amounts: ResponseAllAmounts, paid: boolean, year?: number): ResponseAllAmounts {
    const response: ResponseAllAmounts = {
      entrances:[],
      spents: []
    }

    if (year == undefined) {
      year = this.current.getFullYear();
    }


    response.entrances = [ ...amounts.entrances.filter((entrance) => {
      const dateAmount = new Date(entrance.create_at);
      return dateAmount.getFullYear() === year && entrance.paid;
    })];

    response.spents = [ ...amounts.spents.filter((spent) => {
      const dateAmount = new Date(spent.create_at);
      return dateAmount.getFullYear() === year && spent.paid;
    })];


    return response;
  }


  GerSpentAndEntrancesByCategory(amounts: ResponseAllAmounts,categoryId: number, year?: number): ResponseAllAmounts {
    const response: ResponseAllAmounts = {
      entrances:[],
      spents: []
    }

    if (year == undefined) {
      year = this.current.getFullYear();
    }

    response.entrances = [ ...amounts.entrances.filter((entrance) => {
      const dateAmount = new Date(entrance.create_at);
      return dateAmount.getFullYear() === year && entrance.category == categoryId;
    })];

    response.spents = [ ...amounts.spents.filter((spent) => {
      const dateAmount = new Date(spent.create_at);
      return dateAmount.getFullYear() === year && spent.category == categoryId;
    })];

    return response;
  }

}

