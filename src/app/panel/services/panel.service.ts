import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Amount, CategorysResponse, ResponseAllAmounts} from "../interfaces/interfaces";
import {SpentService} from "./spent.service";
import {EntranceService} from "./entrance.service";

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private http: HttpClient,
             ) { }

  allCategories(): Observable<CategorysResponse>{
    return this.http.get<CategorysResponse>('assets/categories.json')
  }




}
