import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {routesMain} from "../../utils/RoutesMainAplication";
import {ItemLink} from "../../interfaces/ItemLink.interface";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  routes: ItemLink[] = routesMain;

  constructor(private router: Router) {
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth').then();
  }

}
