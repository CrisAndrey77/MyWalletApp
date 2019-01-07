import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import { Gasto } from '../../models/gasto.model'
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the VerGastosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-gastos',
  templateUrl: 'ver-gastos.html',
})
export class VerGastosPage {

  //gastosLista$: Observable<Gasto[]>
  gastosLista$: Gasto[]

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private usuariosServicio: UsuariosServicio,
    private storage: Storage) {
  }

  ionViewWillLoad() {
    var email;
    this.storage.get('email').then((val) => {
      email = val;

    this.gastosLista$ = this.usuariosServicio.obtenerGastoPorUsuario(email).snapshotChanges().map(changes => {
      return changes .map (c => ({
        key: c.payload.key, ...c.payload.val()
        }));
      });
    });

    
  }

}
