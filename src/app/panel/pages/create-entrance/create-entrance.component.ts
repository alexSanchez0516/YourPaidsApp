import {Component, OnInit} from '@angular/core';
import {Amount, Category} from "../../interfaces/interfaces";
import {PanelService} from "../../services/panel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntranceService} from "../../services/entrance.service";
import {alertSuccessTimerShowHide} from "../../../utils/alerts";
import {FirebaseStorageService} from "../../../services/firebase-storage.service";
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'app-create-entrance',
  templateUrl: './create-entrance.component.html',
  styleUrls: ['./create-entrance.component.css']
})
export class CreateEntranceComponent implements OnInit{
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
              private entranceService: EntranceService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe({
      next: (param) => {
        if (param['id']) {
          let paramString = param['id'];
          this.entranceService.getById(paramString)
            .subscribe({
              next: (resp) => {
                if (resp.entrance == null) {
                  this.router.navigateByUrl('./app/inicio').then();
                } else {
                  this.amount = {...resp.entrance}
                }
              },
              error: (error: any) => {
                console.log(error)
                this.router.navigateByUrl('./app/inicio').then();
              }
            })
        }
      }
    });

    this.panelService.allCategories()
      .subscribe({
        next: (categorias) => {
          this.categories = categorias.entrances;
        },
        error: (er) => {
          console.log('error: ' , er);
        }
      })
  }
  save($event: Amount) {
    this.amount = {...$event};
    if (this.amount._id) {
      this.entranceService.update(this.amount)
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
      this.entranceService.save(this.amount)
        .subscribe({
          next: () => {
            alertSuccessTimerShowHide('Guardado correctamente');
            this.router.navigate(['/app/inicio']);
          },
          error: (error: any) => {
            console.log(error);
          }
        })
    }

  }

  delete($event: boolean) {
    if ($event && this.amount._id != undefined) {
      this.entranceService.delete(this.amount._id)
        .subscribe({
          next: (resp) => {
            alertSuccessTimerShowHide("Eliminado correctamente");
            this.router.navigate(['/app/inicio']);
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }
}
