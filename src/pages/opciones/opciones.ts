import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import { Usuario } from '../../models/usuario.model';
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OpcionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opciones',
  templateUrl: 'opciones.html',
})
export class OpcionesPage {

  usuarioLista$: Observable<Usuario[]>;
  usuario: Usuario={
    nombre: '',
    correo: '',
    ingresoMensual: 0,
    registroDeEntradas: '',
    establecimientos: ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private usuarioServicio: UsuariosServicio,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    var email;
    this.storage.get('email').then((val) => {
      email = val;
      this.usuarioLista$ = this.usuarioServicio.obtenerUsuarioPorEmail(email).snapshotChanges().map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      });
    });
  }

editarUsuario(usuario){
    console.log(usuario);
  let email = usuario.correo;
  this.usuarioServicio.editarUsurario(usuario);
  this.navCtrl.setRoot("HomePage");
  this.storage.set('email', email);

}

}
