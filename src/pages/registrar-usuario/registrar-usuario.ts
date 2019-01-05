import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuariosServicio } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegistrarUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar-usuario',
  templateUrl: 'registrar-usuario.html',
})
export class RegistrarUsuarioPage {

  usuario: Usuario={
    nombre: '',
    correo: '',
    ingresoMensual: 0,
    registroDeEntradas: '',
    establecimientos: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private usuarioServicio: UsuariosServicio,
  public angularFireAuth: AngularFireAuth, 
  private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrarUsuarioPage');
  }

  agregarUsuario(usuario: Usuario,password) {
    var email = usuario.correo; 
    this.angularFireAuth.auth.createUserWithEmailAndPassword(email,password).then((res) => {
      this.usuarioServicio.agregarUsuario(usuario).then(ref => {
        this.navCtrl.setRoot('HomePage', {key: ref.key});
        this.storage.set('email', email);
      });
    });
    
  }

}
