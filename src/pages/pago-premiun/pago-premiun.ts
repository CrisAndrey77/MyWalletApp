import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagoPremiunPage');
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

}
