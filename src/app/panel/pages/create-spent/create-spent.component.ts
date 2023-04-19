import {Component, OnInit} from '@angular/core';
import {Amount, Category} from "../../interfaces/interfaces";
import {PanelService} from "../../services/panel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SpentService} from "../../services/spent.service";
import {alertSuccessTimerShowHide} from "../../../utils/alerts";

@Component({
  selector: 'app-create-spent',
  templateUrl: './create-spent.component.html',
  styleUrls: ['./create-spent.component.css']
})
export class CreateSpentComponent implements OnInit{

  categories: Category[] = []
  amount: Amount = {
    category: 0,
    create_at: new Date,
    name: "",
    quantity: 0,
    user: "",
    paid: false,
    date_paid: undefined
  }
  update: boolean = false;
  url_public: string = '';

  constructor(private panelService: PanelService,
              private activatedRouter: ActivatedRoute,
              private spentService: SpentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe({
      next: (param) => {
        if (param['id']) {
          let paramString = param['id'];
          this.spentService.getById(paramString)
            .subscribe({
              next: (resp) => {
                if (resp.spent == null) {
                  this.router.navigateByUrl('/app/inicio').then();
                } else {
                  this.amount = {...resp.spent}
                }
              },
              error: (error: any) => {
                console.log(error)
                this.router.navigateByUrl('/app/inicio').then();
              }
            })
        }
      }
    });

    this.panelService.allCategories()
      .subscribe({
        next: (categorias) => {
          this.categories = categorias.spents;
        },
        error: (er) => {
          console.log('error: ' , er);
        }
      })

  }

  save($event: Amount) {
    this.amount = {...$event};
    if (this.amount._id) {
      this.spentService.update(this.amount)
        .subscribe({
          next: () => {
            alertSuccessTimerShowHide('Guardado correctamente');
            this.router.navigate(['./app/inicio']);
          },
          error: (error: any) => {
            console.log(error);
          }
        })
    } else {
      this.spentService.save(this.amount)
        .subscribe({
          next: () => {
            alertSuccessTimerShowHide('Guardado correctamente');
            this.router.navigate(['./app/inicio']);
          },
          error: (error: any) => {
            console.log(error);
          }
        })
    }
  }

  delete($event: boolean) {
    console.log('event: ', $event);
    if ($event && this.amount._id != undefined) {
      this.spentService.delete(this.amount._id)
        .subscribe({
          next: (resp) => {
            alertSuccessTimerShowHide("Eliminado correctamente");
            this.router.navigate(['./app/inicio']);
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }
}
