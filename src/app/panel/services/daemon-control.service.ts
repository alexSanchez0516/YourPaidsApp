import { Injectable } from '@angular/core';
import { ControlService } from './control.service';
import { CategorysResponse, Control } from '../interfaces/interfaces';
import { AmountService } from './amount.service';
import { PanelService } from './panel.service';
import { alertControlMessage } from 'src/app/utils/alerts';

@Injectable({
  providedIn: 'root'
})
export class DaemonControlService {
  private _controls: Control[] = [];
  private _category: number = -1;
  public categories: CategorysResponse;

  constructor(private controlService: ControlService, private amountService: AmountService, private panelService: PanelService) {

    this.categories = {
      entrances: [],
      spents: []
    };

    this.panelService.allCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (er) => {
          console.log('error: ', er);
        }
      })
  }

  public checkControl(categoryId: number) {
    this.controlService.getControlsByUser().subscribe({
      next: (response) => {
        console.log('check controls passed');
        this._controls = response.controls;
        this._category = categoryId;
        this.checkControlByCategory();
      }, error: (error) => {
        console.log(error);
      }
    });

  }

  private checkControlByCategory() : void {
    let suma = 0;
    const categoryName = this.categories.spents.find((category) => category.id === this._category)!.name;
    const newControlByCategory: Control = this._controls.find((control) =>
                                            control.category === this._category)!;

    if (!newControlByCategory.active) {
      return;
    }
    const currentDate = new Date();
    let start = new Date(); // diario por defecto
    let end = new Date()
    switch (newControlByCategory.period) {
      case 1: // week
        start = this.getMonday();
        end = this.getUpcomingSunday();
        break;
      case 2: // month
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case 3: // year
        start = new Date(currentDate.getFullYear(), 0, 1);
        end = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default:
        break;
    }

    this.amountService.getSpentsByRangeDate(start, end, this._category).subscribe({
      next: (response) => {
        console.log('response spents controls check', response.spents);
        response.spents.forEach((spent) => {
          suma += spent.quantity;
        });

            //* SACAMOS LOS PORCENTAJES DEL CONTROL
        let totalPorcent = 0;
        switch (newControlByCategory.porcentWarning) {
          case 50:
            totalPorcent = (newControlByCategory.quantity * 50) / 100;
            break;

          case 75:
            totalPorcent = (newControlByCategory.quantity * 75) / 100;
            break;

          case 90:
            totalPorcent = (newControlByCategory.quantity * 90) / 100;
            break;

          case 100:
            totalPorcent = newControlByCategory.quantity;
            break;

          default:
            break;
        }

        if (suma >= totalPorcent) {
          setTimeout(() => {
            alertControlMessage(`¡El control de la categoria ${categoryName} se ha disparado, has superado el ${newControlByCategory.porcentWarning}% del importe establecido para este control! MUCHO OJO`);
          }, 3000);

        }

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  private getMonday() : Date {
    const d = new Date();
    const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }


  private getUpcomingSunday() {
    const date = new Date();
    const today = date.getDate();
    const currentDay = date.getDay();
    const newDate = date.setDate(today - currentDay + 7);
    return new Date(newDate);
  }
}
