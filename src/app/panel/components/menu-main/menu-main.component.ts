import {Component, OnInit} from '@angular/core';
import {ItemLink} from "../../../interfaces/ItemLink.interface";
import {routesMain} from "../../../utils/RoutesMainAplication";

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.css']
})
export class MenuMainComponent implements OnInit{

  routes: ItemLink[] = routesMain;

  ngOnInit(): void {
    this.routes = this.routes.filter((route) => route.id != 0);
  }




}
