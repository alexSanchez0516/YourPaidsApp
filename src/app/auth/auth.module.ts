import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveyPasswordComponent } from './pages/recovey-password/recovey-password.component';
import {MaterialModule} from "../material/material.module";
import { HomeComponent } from './pages/home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoveyPasswordComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({ fireOnInit: true }),
    SharedModule
  ]
})
export class AuthModule { }
