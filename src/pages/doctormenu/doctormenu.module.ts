import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctormenuPage } from './doctormenu';

@NgModule({
  declarations: [
    DoctormenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctormenuPage),
  ],
})
export class DoctormenuPageModule {}
