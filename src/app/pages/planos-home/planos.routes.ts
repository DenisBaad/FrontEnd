import { Routes } from "@angular/router";
import { PlanosHomeComponent } from "./planos-home.component";

export const routes: Routes = [
  {
    path: '',
    component: PlanosHomeComponent ,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: PlanosHomeComponent ,
      }
    ]
  }
];
