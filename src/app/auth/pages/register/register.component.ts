import { Component } from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../helpers/MyErrorStateMatcher";
import {emailPattern, notSpacer} from "../../../helpers/Patterns";
import {UtilService} from "../../../services/util.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../../interfaces/User";
import {SweetAlertIcon} from "sweetalert2";
import {Router} from "@angular/router";

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup = this.fb.group({
    'username': ['', [
      Validators.required, Validators.minLength(4),
      Validators.pattern(notSpacer)
    ],[]],
    'email': ['', [
      Validators.required, Validators.pattern(emailPattern)
    ],[]],
    'password1': ['', [
      Validators.required, Validators.minLength(6),
      Validators.pattern(notSpacer)
    ],[]],
    'password2': ['', [
      Validators.required, Validators.minLength(6),
      Validators.pattern(notSpacer)
    ],[]],
  }, {
    validators: [this.utilService.equalsFields('password1', 'password2')]
  })

  hide = true;
  matcher = new MyErrorStateMatcher();
  authRegisterResponse: boolean = false;
  authRegisterResponseMessage: string = '';
  authRegisterResponseIcon: SweetAlertIcon = 'error';

  constructor (
    private matIconRegistry: MatIconRegistry,
    private fb: FormBuilder,
    private utilService: UtilService,
    private router: Router,
    private authService: AuthService,
    private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
  }

  public campoIsInvalid(item: string): boolean {
    return <boolean><unknown>this.registerForm.get(item)?.errors
  }


  save() {
    if (this.registerForm.valid) {
      //this.authService.register();
      const { username,  password1, email } = this.registerForm.value;
      const user: User = {
        username,
        password: password1,
        email
      };
      this.authService.register(user)
          .subscribe({
            next: (resp) => {
              this.authRegisterResponse = true
              if (resp) {
                this.authRegisterResponseIcon = 'success';
                this.authRegisterResponseMessage = 'Cuenta creada correctamente'

                setTimeout(() => {
                  this.router.navigateByUrl('app/inicio').then();
                }, 3000)

              } else {
                this.authRegisterResponseIcon = 'error';
                this.authRegisterResponseMessage = 'Ya existe una cuenta con ese email'
             }
            },
            error: (err) => {
              this.authRegisterResponseMessage = err.toString();
              console.log(err);
            }
          })
    }
  }
}
