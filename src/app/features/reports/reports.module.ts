import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchViewComponent } from './reports-view/reports-view.component';
import { SearchRoutingModule } from './reports-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SearchViewComponent,
    TranslateModule
  ]
})
export class SearchModule { }
