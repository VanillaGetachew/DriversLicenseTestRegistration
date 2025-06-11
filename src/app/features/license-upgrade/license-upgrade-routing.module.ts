import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenseSearchComponent } from './license-search/license-search.component';
import { LicenseUpgradeFormComponent } from './license-upgrade-form/license-upgrade-form.component';

const routes: Routes = [
  {
    path: '',
    component: LicenseSearchComponent
  },
  {
    path: 'form/:licenceGrade/:licenceNo',
    component: LicenseUpgradeFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseUpgradeRoutingModule { }
