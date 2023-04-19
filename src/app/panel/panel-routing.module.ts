import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {MainComponent} from "./pages/main/main.component";
import {SpentsComponent} from "./pages/spents/spents.component";
import {EntrancesComponent} from "./pages/entrances/entrances.component";
import {CreateSpentComponent} from "./pages/create-spent/create-spent.component";
import {CreateEntranceComponent} from "./pages/create-entrance/create-entrance.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {ConfigUserComponent} from "./pages/config-user/config-user.component";
import {ErrorPageComponent} from "../shared/error-page/error-page.component";
import {MovementsComponent} from "./pages/movements/movements.component";
import { ControlsPaymentsComponent } from './pages/controls-payments/controls-payments.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'inicio',
        component: MainComponent
      },
      {
        path: 'gastos',
        component: SpentsComponent
      },
      {
        path: 'ingresos',
        component: EntrancesComponent
      },
      {
        path: 'movimientos',
        component: MovementsComponent
      },
      {
        path: 'crear-gasto',
        component: CreateSpentComponent
      },
      {
        path: 'crear-ingreso',
        component: CreateEntranceComponent
      },

      {
        path: 'editar-gasto/:id',
        component: CreateSpentComponent
      },
      {
        path: 'editar-ingreso/:id',
        component: CreateEntranceComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'opciones',
        component: ConfigUserComponent
      },
      {
        path: 'control-gastos',
        component: ControlsPaymentsComponent
      },
      {
        path: '**',
        redirectTo: 'login'
      },
      {
        path: '404',
        component: ErrorPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
