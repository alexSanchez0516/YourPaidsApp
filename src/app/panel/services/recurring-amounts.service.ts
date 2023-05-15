import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { responseAllRecurringAmount } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { SpentService } from './spent.service';
import { EntranceService } from './entrance.service';


@Injectable({
  providedIn: 'root'
})
export class RecurringAmountsService {

  constructor(private http: HttpClient, private spentService: SpentService, private entranceService: EntranceService) { }


  getAmountsRecurring() : void {
    let idUser = localStorage.getItem('uid') || '';
    let url = `${environment.endpoint}/app/recurring/user/${idUser}`;
    console.log(url);
    this.http.get<responseAllRecurringAmount>(url).subscribe({
      next: (response) => {
        response.entranceRecurring.forEach((entrance) => {
          if (entrance.createByRecurringService == undefined || entrance.createByRecurringService == null || !entrance.createByRecurringService) {
            entrance._id = undefined;
            entrance.createByRecurringService = true;
            entrance.create_at = new Date();
            entrance.date_paid = new Date();

            this.entranceService.save(entrance).subscribe({
              next: (response) => {
                console.log(response);
              },
              error: (error) => {
                console.log(error);
              }
            });
          }
        });
        response.spentRecurring.forEach((spent) => {
          if (spent.createByRecurringService == undefined || spent.createByRecurringService == null || !spent.createByRecurringService) {
            spent._id = undefined;
            spent.createByRecurringService = true;
            spent.create_at = new Date();
            spent.date_paid = new Date();
            this.spentService.save(spent).subscribe({
              next: (response) => {
                console.log(response);
              },
              error: (error) => {
                console.log(error);
              }
            });
          }

        });

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
