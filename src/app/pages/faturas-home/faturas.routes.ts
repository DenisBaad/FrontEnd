import { Routes } from "@angular/router";
import { FaturasHomeComponent } from "./faturas-home.component";

export const routes: Routes = [
  {
    path: '',
    component: FaturasHomeComponent ,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: FaturasHomeComponent ,
      }
    ]
  }
];
