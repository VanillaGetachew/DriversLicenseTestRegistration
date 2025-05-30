import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'registration',
        loadChildren: () => import('./features/registration/registration.module').then(m => m.RegistrationModule)
      },
      {
        path: 'license-upgrade',
        loadChildren: () => import('./features/license-upgrade/license-upgrade.module').then(m => m.LicenseUpgradeModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'profile',
        loadComponent: () => import('./shared/profile/profile.component').then(c => c.ProfileComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
  // { path: '**', redirectTo: 'auth' }
];