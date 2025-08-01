import { Routes } from "@angular/router";
import { RelatorioFaturasComponent } from "./relatorio-faturas.component";

export const routes: Routes = [
  {
    path: '',
    component: RelatorioFaturasComponent ,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: RelatorioFaturasComponent ,
      }
    ]
  }
];
