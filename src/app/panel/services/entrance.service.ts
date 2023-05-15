import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Amount, updateResponseAmounts} from "../interfaces/interfaces";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class EntranceService {

  private base_url = environment.endpoint;

  constructor(private http: HttpClient) { }

  /**
   *
   * @param id
   */
  getById(id: string) {
    let url = `${this.base_url}/app/entrances/${id}`;
    console.log(url);
    return this.http.get<any>(url)
  }

  /**
   *
   * @param entrance
   */
  save(entrance: Amount): Observable<Amount> {
    let url = `${this.base_url}/app/create-entrance`;
    console.log(url);
    return this.http.post<Amount>(url, entrance);

  }

  /**
   *
   * @param entrance
   */
  update(entrance: Amount) {
    let url = `${this.base_url}/app/update-entrance`;
    console.log(url);
    return this.http.post<Amount>(url, entrance);
  }

  /**
   *
   * @param id
   */
  delete(id: string) : Observable<updateResponseAmounts> {
    let url = `${this.base_url}/app/delete-entrance/${id}`;
    console.log(url);
    return this.http.delete<updateResponseAmounts>(url);
  }

  allByUser(uid: string) : Observable<Amount[]>{
    const url = `${this.base_url}/app/entrances/user/${uid}`;
    console.log(url);
    return this.http.get<Amount[]>(url);
  }

}
