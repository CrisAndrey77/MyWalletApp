import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import { Usuario } from '../../models/usuario.model';
import { AngularFireAuth} from 'angularfire2/auth';
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';


/**
 * Generated class for the VerUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-usuario',
  templateUrl: 'ver-usuario.html',
})
export class VerUsuarioPage {

  usuarioLista$: Observable<Usuario[]>;
  usuario: Usuario={
    nombre: '',
    correo: '',
    ingresoMensual: 0,
    registroDeEntradas: '',
    establecimientos: '',
    premium:false
  };
  listaUsuariosSubscription: Subscription;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public angularFireAuth: AngularFireAuth,
    private usuarioServicio: UsuariosServicio,
    private storage: Storage) {
  }

  ionViewWillLoad() {
    var email;
    this.storage.get('email').then((val) => {
      email = val;
      this.usuarioLista$ = this.usuarioServicio.obtenerUsuarioPorEmail(email).snapshotChanges().map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      });

      this.listaUsuariosSubscription = this.usuarioLista$.subscribe( user =>{});
    });
  }

  /* ES IMPORTANTE QUE, CUANDO SE ABANDONE LA PAGINA,
  SE DESUSCRIBA DE LA CONSULTA A LA BASE DE DATOS, PARA QUE NO HAYAN ERRORES
  AL DESLOGEARSE DE LA APLICACION*/
  ionViewWillLeave(){
    this.listaUsuariosSubscription.unsubscribe();
  }

}
