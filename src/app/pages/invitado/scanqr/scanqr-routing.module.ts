import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanQrPage } from './scanqr.page';

const routes: Routes = [
  {
    path: '',
    component: ScanQrPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanqrPageRoutingModule {}
