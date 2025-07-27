import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'clientes'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.routes)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes-home/clientes.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '/clientes',
    pathMatch: 'full'
  }
];
