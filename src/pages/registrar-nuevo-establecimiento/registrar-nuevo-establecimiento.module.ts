import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrarNuevoEstablecimientoPage } from './registrar-nuevo-establecimiento';

@NgModule({
  declarations: [
    RegistrarNuevoEstablecimientoPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrarNuevoEstablecimientoPage),
  ],
})
export class RegistrarNuevoEstablecimientoPageModule {}
