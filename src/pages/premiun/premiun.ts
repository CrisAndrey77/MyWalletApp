import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AdMob } from 'ionic-admob';
/**
 * Generated class for the PremiunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-premiun',
  templateUrl: 'premiun.html',
})
export class PremiunPage {

  planMensual = {
    pago: "2.99",
    plan: "Mensual",
    metodo: "mes"
  };

  planAnual = {
    pago: "29.99",
    plan: "Anual",
    metodo: "año"
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private admob:AdMob) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PremiunPage');
    this.admob.banner.hide('ca-app-pub-3940256099942544/6300978111');
  }

  goPremiunMensual() {
    this.navCtrl.push('PagoPremiunPage', this.planMensual);
  }

  goPremiunAnual(){
    this.navCtrl.push('PagoPremiunPage', this.planAnual);
  }

}
