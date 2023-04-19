import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { LogoComponent } from './logo/logo.component';
import {MaterialModule} from "../material/material.module";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    ErrorPageComponent,
    SidenavComponent,
    FooterComponent,
    LogoComponent,
    SidenavComponent
  ],
  exports: [
    LogoComponent,
    FooterComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink
  ]
})
export class SharedModule { }
