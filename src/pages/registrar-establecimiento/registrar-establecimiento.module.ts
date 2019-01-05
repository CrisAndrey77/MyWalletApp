import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrarEstablecimientoPage } from './registrar-establecimiento';

@NgModule({
  declarations: [
    RegistrarEstablecimientoPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrarEstablecimientoPage),
  ],
})
export class RegistrarEstablecimientoPageModule {}
