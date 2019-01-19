import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Gasto } from '../../models/gasto.model';
import { UsuariosServicio } from '../../services/usuarios.service';

/**
 * Generated class for the RegistrarEstablecimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var require: any

@IonicPage()
@Component({
  selector: 'page-registrar-establecimiento',
  templateUrl: 'registrar-establecimiento.html',
})
export class RegistrarEstablecimientoPage {
  place:any ={
    name: '',
    vicinity:'',
    rating:'',
    types:[]
  };

  gasto:Gasto={
    nombre: '',
    email_usuario:'',
    descripcion: '',
    categoria:'',
    valor: 0,
    idEstablecimiento: '',
    fecha: ''
  }

  categorias: any;
  categoria:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    private usuarioServicio: UsuariosServicio,) {

  }

  ionViewWillLoad() {
    
    this.storage.get('place').then((val) => {
      this.place = val;
      console.log(this.place);
      if(val && !val.rating){
        this.place.rating = 'Sin especificar';
      }
      this.categorias = val.types;
    });
    
  }

  agregarGasto(gasto:Gasto){
    this.storage.get('email').then((val) => {
      this.gasto.email_usuario = val;
      this.gasto.idEstablecimiento = this.place.name;
      this.gasto.categoria = this.categoria;
      //calculando fecha actual
      let dateFormat = require('dateformat');
      let now = new Date();

      this.gasto.fecha=dateFormat(now, "dd, mm, yyyy, h:MM:ss TT"); 
      this.usuarioServicio.agregarGasto(gasto).then(ref => {
        this.navCtrl.setRoot('HomePage');

      });

    });
  }

}
