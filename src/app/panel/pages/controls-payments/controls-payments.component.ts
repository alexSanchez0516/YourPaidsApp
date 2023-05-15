import { Component } from '@angular/core';
import { CategorysResponse,
   Control, ControlsResponse
  , Period, updateResponseControl } from '../../interfaces/interfaces';
import { PanelService } from '../../services/panel.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/helpers/MyErrorStateMatcher';
import { notSpacer, onlyNumbers } from 'src/app/helpers/Patterns';
import { ControlService } from '../../services/control.service';
import { alertError, alertSuccessTimerShowHide } from 'src/app/utils/alerts';

@Component({
  selector: 'app-controls-payments',
  templateUrl: './controls-payments.component.html',
  styleUrls: ['./controls-payments.component.css']
})
export class ControlsPaymentsComponent {

  public categories: CategorysResponse;
  matcher = new MyErrorStateMatcher();
  public periods: Period[] = []; // 0: diario / 1: semanal / 3: mensual / 4: anual
  public control: Control = {
    quantity: 0,
    user: localStorage.getItem('uid')!,
    category: -1,
    create_at: new Date(),
    active: true,
    porcentWarning: 75,
    period: 2
  };
  public controlsData: ControlsResponse;
  public update: boolean = false;
  public idDelete : string = '';
  public deleteAction = false;
  public showList = false;
  public currency = localStorage.getItem('currency');
  formControl = this.fb.group({
    'category': [this.control.category, [
      Validators.required],
    ,[]],
    'period': [this.control.period, [
      Validators.required],
    ,[]],
    'porcent': [this.control.porcentWarning, [
      Validators.required],
    ,[]],
    'active': [true, [
      ],
    ,[]],
    'quantity': [this.control.quantity, [ Validators.required, Validators.min(1),
      Validators.pattern(notSpacer),
      Validators.pattern(onlyNumbers)], []],
  });

  public checkbuttonsContent: string[] = ["Activo", "Desativar"];

  constructor(private panelService: PanelService,private fb: FormBuilder,
    private controlService: ControlService) {
    this.categories = {
      entrances: [],
      spents: []
    }

    this.periods = [
      {id: 0, name: 'diario'},
      {id: 1, name:'semanal'},
      {id: 2, name:'mensual'},
      {id: 3, name: 'anual'}
    ];

    this.clearControl();
    this.controlsData = {
      controls: []
    }


  }

  ngOnInit() {

    this.panelService.allCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (er) => {
          console.log('error: ', er);
        }
      })

      this.getByUser();
  }

  public campoIsInvalid(item: string): boolean {
    return <boolean><unknown>this.formControl.get(item)?.errors
  }

  public save() {
    if (this.formControl.valid && this.formControl.value.quantity! > 0
                               && this.formControl.value.porcent! != null
                               && this.formControl.value.category != null )  {

      this.control.quantity = this.formControl.value.quantity!;
      this.control.porcentWarning = this.formControl.value.porcent!;
      this.control.category = this.formControl.value.category!;
      this.control.active = this.formControl.value.active!;
      this.control.period = this.formControl.value.period!;

      if (this.control._id != null && this.control._id != undefined) {

        if (this.controlsData.controls.some((control) =>
         (control.category == this.control.category && control._id != this.control._id))) {
          alertError("Ha ocurrido un error en el proceso, UNA CATEGORÍA NO PUEDE TENER MÁS DE UNA ALERTA");
          return;

        }

        this.controlService.updateControl(this.control).subscribe({
          next: (controlResponse : updateResponseControl) => {
            console.log(controlResponse.status);
            if (controlResponse.status == 'success') {
              const index1 = this.controlsData.controls.findIndex(control => control._id === this.control._id);
              this.controlsData.controls[index1] = this.control;
              this.formControl.reset();
              this.removeValidators();
              this.clearControl();
              alertSuccessTimerShowHide('Actualizado correctamente');
            }
          }, error: (er) => {
              alertError(`error internal: ${er.message}`);
          }
        });
        return;
      }

      if (this.controlsData.controls.some((control) => control.category == this.control.category)) {
        alertError("Ha ocurrido un error en el proceso, UNA CATEGORÍA NO PUEDE TENER MÁS DE UNA ALERTA");
        return;

      }
      this.controlService.saveControl(this.control).subscribe({
        next: (control) => {
          this.controlsData.controls.push(control);
          alertSuccessTimerShowHide('Guardado correctamente');
          this.formControl.reset();
          this.removeValidators();
          this.clearControl();

        },
        error: (er) => {
          alertError(`error internal: ${er.message}`);
        }
      });
    } else {
      alertError("Ha ocurrido un error en el proceso, los datos son incorrecto, rellena bien el formulario");
    }
  }

  private clearControl() {
    this.control = {
      _id: undefined,
      quantity: 0,
      user: localStorage.getItem('uid')!,
      category: -1,
      create_at: new Date(),
      active: true,
      porcentWarning: 75,
      period: 2
    }
  }

  public seachTextCategory(idCategory: number) {
    return this.categories.spents.find((category) => category.id == idCategory)?.name || '';
  }

  public addValidators() {

    for (const key in this.formControl.controls) {

      if (key == 'quantity') {
        this.formControl.get(key)!.setValidators([ Validators.required, Validators.min(1),
          Validators.pattern(notSpacer),
          Validators.pattern(onlyNumbers)]);

      } else {
        this.formControl.get(key)!.setValidators([Validators.required]);
      }
    }
  }

  public removeValidators() {
    for (const key in this.formControl.controls) {
        this.formControl.get(key)!.clearValidators();
        this.formControl.get(key)!.updateValueAndValidity();
    }
  }

  public select(id: string) {
    this.idDelete = id;
    const controlSelect = this.controlsData.controls.find((control) => control._id == id);

    if (controlSelect != undefined && controlSelect != null) {
      this.control = controlSelect;
      this.formControl.get('quantity')?.setValue(this.control.quantity);
      this.formControl.get('category')?.setValue(this.control.category);
      this.formControl.get('porcent')?.setValue(this.control.porcentWarning);
      this.formControl.get('active')?.setValue(this.control.active);
      this.formControl.get('period')?.setValue(this.control.period);
      this.update = true;
    }

  }

  public delete() {
    if (this.idDelete != '' && this.idDelete != null) {
      this.controlService.deleteControl(this.idDelete).subscribe({
        next: (controlResponse : updateResponseControl) => {
          if (controlResponse.status == 'success') {
            const index1 = this.controlsData.controls.findIndex(control => control._id === this.idDelete);
            this.controlsData.controls.splice(index1, 1);
            alertSuccessTimerShowHide('Eliminado correctamente');
            this.deleteAction = false;
            this.update = false;
            this.formControl.reset();
            this.removeValidators();
            this.clearControl();
          }
        },
        error: (er) => {
          alertError(`error internal: ${er.message}`);
        }
      });
    }
  }

  public getByUser() {
    this.controlService.getControlsByUser().subscribe({
      next: ({controls}) => {
        if (controls.length > 0) {
          this.showList = true;
        }
        controls.forEach((control, index) => {
          this.controlsData.controls.push(control);
        });
      },
      error: (er) => {
        alertError(`error internal: ${er.message}`);
      }
    });

  }


}
