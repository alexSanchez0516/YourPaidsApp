import {Component, OnInit} from '@angular/core';
import {ItemLink} from "../../../interfaces/ItemLink.interface";
import {Router} from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  links: ItemLink[] = [
    {
      text: 'Iniciar sesión',
      url: './login'
    },
    {
      text: 'Crear cuenta',
      url: './register'
    }
  ]

  constructor(private router: Router) {
  }
  activeLink: ItemLink = this.links[0];

  ngOnInit(): void {
    if (this.router.url === '/register') {
      this.activeLink = this.links[1];
    }
  }
}
