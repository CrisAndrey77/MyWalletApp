import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import {AdMob} from 'ionic-admob';

import { Usuario } from '../../models/usuario.model';
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

/**
 * Generated class for the PagoPremiunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-pago-premiun',
  templateUrl: 'pago-premiun.html',
})
export class PagoPremiunPage {
  public ocultar1: boolean = true;
  public ocultar2: boolean = false;
  public ocultar3: boolean = false;
  plan: string; 
  objetoRecibido: any;


  usuarioListaSubscription: Subscription;
  usuario: Usuario = {
    key: '',
    correo:'',
    nombre: '',
    ingresoMensual: 0,
    registroDeEntradas:'',
    establecimientos:'',
    premium:false,
  };
  email:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private payPal: PayPal,
    private admob: AdMob,
    private platform: Platform,
    private usuarioServicio: UsuariosServicio,
    private storage: Storage) {
    this.objetoRecibido = navParams.data;
    this.plan = navParams.get("plan");
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagoPremiunPage');
    this.admob.banner.hide('ca-app-pub-3940256099942544/6300978111');
  }

  showHide1(){
    this.ocultar2 = false;
    this.ocultar3 = false;
    this.ocultar1 = !this.ocultar1;
  }

  showHide2(){
    this.ocultar1 = false;
    this.ocultar3 = false;
    this.ocultar2 = !this.ocultar2;
  }

  showHide3(){
    this.ocultar2 = false;
    this.ocultar1 = false;
    this.ocultar3 = !this.ocultar3;
  }

  goPremiun() {
    this.navCtrl.push('PremiunPage');
  }

  makePayment(){
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AXOJ-mbvqZm9zuD7AHmFaJYOEIM-034qaBQ25vLdJJYfNaKUD0ifi33WtcYI958sHeVA4DHD26-myb_7'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.objetoRecibido.pago, 'USD', 'Plan Premium', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((response) => {
          // Successfully paid
    
          //this.navCtrl.push('HomePage', response.response);

          this.storage.get('email').then((val) => {
            this.email = val;
              this.usuarioListaSubscription =this.usuarioServicio.obtenerUsuarioPorEmail(this.email).snapshotChanges().map(changes => {
                return changes.map(c => ({
                  key: c.payload.key, ...c.payload.val()
                }))
              })
              .subscribe(users => {            
                this.usuario.nombre =users[0].nombre;
                this.usuario.ingresoMensual = users[0].ingresoMensual;
                this.usuario.correo = users[0].correo;
                this.usuario.key = users[0].key;

                // ACA SE ASIGNA EL PREMIUM
                this.usuario.premium = true;
                this.storage.set('premium', this.usuario.premium);

                this.usuarioServicio.editarUsurario(this.usuario, this.usuario.key);

                this.navCtrl.setRoot("HomePage");
              });
             
            });
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, (err) => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log("Error", " Error in initialization, maybe PayPal isn't supported or something else. Error: " + JSON.stringify(err));
    });
  }

  ionViewWillLeave(){
    this.storage.get('premium').then((val) => {
      if(val){
        if(val===true){
          this.admob.banner.hide('ca-app-pub-3940256099942544/6300978111');
        }else{
          this.admob.banner.show({
            id: 'ca-app-pub-3940256099942544/6300978111'
          });
        }
      }else{
        this.admob.banner.show({
          id: 'ca-app-pub-3940256099942544/6300978111'
        });
      }
    });
  }
}
