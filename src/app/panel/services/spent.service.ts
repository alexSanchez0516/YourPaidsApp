import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Amount, updateResponseAmounts} from "../interfaces/interfaces";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SpentService {

  private base_url = environment.endpoint;

  constructor(private http: HttpClient) { }

  /**
   *
   * @param id
   */
  getById(id: string) {
    let url = `${this.base_url}/app/spents/${id}`;
    console.log(url);
    return this.http.get<any>(url)
  }

  /**
   *
   * @param entrance
   */
  save(entrance: Amount): Observable<Amount> {
    let url = `${this.base_url}/app/create-spent`;
    console.log(url);
    return this.http.post<Amount>(url, entrance);

  }

  /**
   *
   * @param entrance
   */
  update(entrance: Amount) {
    let url = `${this.base_url}/app/update-spent`;
    console.log(url);
    return this.http.post<Amount>(url, entrance);
  }

  /**
   *
   * @param id
   */
  delete(id: string) : Observable<updateResponseAmounts> {
    let url = `${this.base_url}/app/delete-spent/${id}`;
    console.log(url);
    return this.http.delete<updateResponseAmounts>(url);
  }

  allByUser(uid: string) : Observable<Amount>{
      const url = `${this.base_url}/app/spents/user/${uid}`;
      console.log(url);
      return this.http.get<Amount>(url);
  }

}
