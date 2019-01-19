
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import { Usuario } from '../../models/usuario.model';
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

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
  usuarioListaSubscription: Subscription;
  usuario: Usuario = {
    key: '',
    correo:'',
    nombre: '',
    ingresoMensual: 0,
    registroDeEntradas:'',
    establecimientos:''
  };
  temp: Usuario = {
    key: '',
    correo:'',
    nombre: '',
    ingresoMensual: 0,
    registroDeEntradas:'',
    establecimientos:''
  };
  llaveTemp:string;
  llaveMaestra:string;
  email;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private usuarioServicio: UsuariosServicio,
              private storage: Storage,
              private loadingController: LoadingController) {
                this.cargaInfoUsuario();
  }

  ionViewDidLoad() {/*
    let email;
    this.storage.get('email').then((val) => {
      email = val;
      console.log(email);
      this.usuarioLista= this.usuarioServicio.obtenerUsuarioPorEmail(email).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val();
        }))
      })
    });*/
  }

  async cargaInfoUsuario(){
    let carga = this.loadingController.create({
      content: 'Recuperando datos del usuario, por favor espere',
    });
    carga.present();
    setTimeout(() =>{
      carga.dismiss();
    }, 500);
    this.storage.get('usuario').then((us) => {  
      this.storage.get('email').then((val) => {
        this.email = val;
          this.usuarioListaSubscription =this.usuarioServicio.obtenerUsuarioPorEmail(this.email).snapshotChanges().map(changes => {
            return changes.map(c => ({
              key: c.payload.key, ...c.payload.val()
            }))
          })
          .subscribe(users => {            
           this.temp.nombre =users[0].nombre;
            this.temp.ingresoMensual = users[0].ingresoMensual;
            this.temp.correo = users[0].correo;
            this.temp.key = users[0].key;
          });
         
        });
      });
      this.usuario = await this.temp;
  }

editarUsuario(){
  let usuarioEnvia:Usuario={
    nombre: '',
    ingresoMensual:0,
    correo:'',
    establecimientos:'',
    registroDeEntradas:''
  }
  usuarioEnvia.nombre = this.usuario.nombre;
  usuarioEnvia.correo = this.usuario.correo;
  usuarioEnvia.ingresoMensual = this.usuario.ingresoMensual;
  this.usuarioServicio.editarUsurario(this.usuario, this.usuario.key);
}

/* ES IMPORTANTE QUE, CUANDO SE ABANDONE LA PAGINA,
  SE DESUSCRIBA DE LA CONSULTA A LA BASE DE DATOS, PARA QUE NO HAYAN ERRORES
  AL DESLOGEARSE DE LA APLICACION*/
  ionViewWillLeave(){
    this.usuarioListaSubscription.unsubscribe();
  }

}
