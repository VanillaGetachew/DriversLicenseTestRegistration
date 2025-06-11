import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { LicenseUpgradeRoutingModule } from './license-upgrade-routing.module';
import { LicenseSearchComponent } from './license-search/license-search.component';
import { LicenseUpgradeFormComponent } from './license-upgrade-form/license-upgrade-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    LicenseUpgradeRoutingModule,
    LicenseSearchComponent,
    LicenseUpgradeFormComponent
  ]
})
export class LicenseUpgradeModule { }
