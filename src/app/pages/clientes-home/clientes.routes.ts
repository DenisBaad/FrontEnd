import { Routes } from '@angular/router';
import { ClientesHomeComponent } from './clientes-home.component';


export const routes: Routes = [
  {
    path: '',
    component: ClientesHomeComponent ,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: ClientesHomeComponent ,
      }
    ]
  }
];
