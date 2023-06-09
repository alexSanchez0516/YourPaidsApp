import { Component } from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../helpers/MyErrorStateMatcher";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../../interfaces/User";
import {emailPattern, notSpacer} from "../../../helpers/Patterns";
const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //test1@test.com - 123456789
  loginForm: FormGroup = this.fb.group({
    'email': ['', [
      Validators.required, Validators.pattern(emailPattern)
    ],[]],
    'password': ['', [
      Validators.required, Validators.minLength(6),
      Validators.pattern(notSpacer)
    ],[]],

  })
  hide = true;
  matcher = new MyErrorStateMatcher();
  isCredentialError: boolean = false;

  constructor (
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
  }


  signInWithGoogle(): void {

  }

  signOut(): void {

  }

  refreshToken(): void {
  }

  public campoIsInvalid(item: string): boolean {
    return <boolean><unknown>this.loginForm.get(item)?.errors
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != '') {
      this.router.navigateByUrl('app/inicio').then();
    }

  }

  login() {
    if (this.loginForm.valid) {
      const user: User = {...this.loginForm.value};
      this.authService.login(user).subscribe({
        next: resp => {
          if (resp) {
            this.router.navigateByUrl('app/inicio').then();
          } else {
            this.isCredentialError = true;
          }
        },
        error: e => {
          console.log('error: ', e);
        }
      })
    }
  }
}
