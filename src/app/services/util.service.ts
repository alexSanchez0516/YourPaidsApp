import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  equalsFields(campo1: string, campo2: string) {

    console.log(`campo1:  ${campo1} --- campo2: ${campo2}`);
    return ( formGroup: AbstractControl): ValidationErrors | null => {

      const pass1 = formGroup.get(campo1)?.value;
      const pass2 = formGroup.get(campo2)?.value;

      if (pass1 !== pass2) {
        formGroup.get(campo2)?.setErrors({notEquals : true});
        return {
          notEquals : true
        }
      }

      formGroup.get(campo2)?.setErrors(null);
      return null;
    }

  }


}
