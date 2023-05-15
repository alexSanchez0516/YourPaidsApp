import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { alertControlMessage, alertSuccessTimerShowHide } from 'src/app/utils/alerts';

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.component.html',
  styleUrls: ['./config-user.component.css'],
})
export class ConfigUserComponent {
  public hide: boolean = true;
  public usePin = false;
  public storageSavedPin: string = '';
  public storageSavedCurrency: string = '';
  public sharedCopyLink = 'test';


  formConfig = this.fb.group({
    currency: ['', [], []],
    usePin: ['', [], []],
  });

  constructor(
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet
  ) {}

  save() {
    if (this.formConfig.valid) {
      if (this.storageSavedCurrency != this.formConfig.get('currency')?.value!) {
        localStorage.setItem('currency', this.formConfig.get('currency')?.value!);
      }

      alertSuccessTimerShowHide('Se ha guardado la configuración');

    }
  }

  openLink($event: MouseEvent) {}

  ngOnInit(): void {
    this.storageSavedCurrency = localStorage.getItem('currency') || '';
    if (this.storageSavedCurrency != '') {
      this.formConfig.get('currency')?.setValue(this.storageSavedCurrency);
    }
  }

  support() {
    alertControlMessage('Email de soporte yourpaids@gmail.com');
  }


  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
