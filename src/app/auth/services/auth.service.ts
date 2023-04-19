import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../interfaces/User";
import {catchError, map, Observable, of, tap} from "rxjs";
import {AuthResponse} from "../intefaces/AuthResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.endpoint;
  private _user! : User;



  get user(): User {
    return {...this._user};
  }

  set user(value: User) {
    this._user = value;
  }

  constructor(private http: HttpClient) {

  }

  /**
   *
   * @param user
   */
  login(user: User) {
    const url = `${this.baseUrl}/auth/`;
    return this.http.post<AuthResponse>(url, user)
      .pipe(
        tap( resp => {
          this.mapResponseAndSetToken(resp);
        }),
        map( resp => resp.ok),
        catchError(err => of(false))
      )
  }

  /**
   *
   * @param resp
   * @private
   */
  private mapResponseAndSetToken(resp: AuthResponse){
    if (resp.ok) {
      localStorage.setItem('uid', resp.uid)
      localStorage.setItem('token', resp.token!);
      this._user = {
        username: resp.username,
        uid: resp.uid,
      }
    }
  }

  /**
   *
   * @param user
   */
  register(user: User) {
    const url = `${this.baseUrl}/auth/new`;
    return this.http.post<AuthResponse>(url, user)
      .pipe(
        tap( resp => {
          this.mapResponseAndSetToken(resp);
        }),
        map( resp => resp.ok),
        catchError(err => of(false))
      )
  }

  /**
   *
   */
  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const url = `${this.baseUrl}/auth/renew`;

    const headers = new HttpHeaders()
      .set('x-token', token);

    return this.http.get<AuthResponse>(url, {headers})
      .pipe(
        map( resp => {
          this.mapResponseAndSetToken(resp);
          return resp.ok
        }),
        catchError( err => of(false))
      )
  }
}
