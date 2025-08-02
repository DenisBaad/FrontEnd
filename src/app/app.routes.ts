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
    loadChildren: () => import('./pages/clientes-home/clientes.routes').then(m => m.routes),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'planos',
    loadChildren: () => import('./pages/planos-home/planos.routes').then(m => m.routes),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'faturas',
    loadChildren: () => import('./pages/faturas-home/faturas.routes').then(m => m.routes),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./pages/relatorio-faturas/relatorio.routes').then(m => m.routes),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  }
];
