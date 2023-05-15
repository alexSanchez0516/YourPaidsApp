import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {

  public showBig = true;
  public rute = this.router.url; //  /tu-ruta

  constructor(private router: Router){
    if (this.rute != '/auth/login') {
      this.showBig = false;
    }
  }

  redirectToHome() {
    this.router.navigateByUrl('/app/inicio');
  }
}
