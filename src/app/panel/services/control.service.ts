import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Control, ControlsResponse, updateResponseControl} from "../interfaces/interfaces";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ControlService {
  private idUser: string = localStorage.getItem('uid') || '';

  constructor(private http: HttpClient) {
  }


  public getControlsByUser() : Observable<ControlsResponse>{
    let url = `${environment.endpoint}/app/controls/user/${this.idUser}`;
    console.log(url);
    return this.http.get<ControlsResponse>(url);
  }

  public getControlById(id: string): Observable<Control> {
    let url = `${environment.endpoint}/app/control/${id}`;
    console.log(url);
    return this.http.get<Control>(url);
  }

  public saveControl(control: Control): Observable<Control> {
    let url = `${environment.endpoint}/app/create-control`;
    console.log(url);
    return this.http.post<Control>(url, control);
  }


  public updateControl(control: Control): Observable<updateResponseControl> {
    let url = `${environment.endpoint}/app/update-control`;
    console.log(url);
    return this.http.post<updateResponseControl>(url, control);
  }

  public deleteControl(id: string) : Observable<updateResponseControl> {

    let url = `${environment.endpoint}/app/delete-control/${id}`;
    console.log(url);
    return this.http.delete<updateResponseControl>(url);
  }


}
