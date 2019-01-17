import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PopOverUsuarioComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pop-over-usuario',
  templateUrl: 'pop-over-usuario.html'
})
export class PopOverUsuarioComponent {
  username:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  verInfoUsuario(){
    this.navCtrl.push('VerUsuarioPage');
  }

  verGastosUsuario(){
    this.navCtrl.push('VerGastosPage');
  }

  cerrarSesionUsuario(){
  }
}
