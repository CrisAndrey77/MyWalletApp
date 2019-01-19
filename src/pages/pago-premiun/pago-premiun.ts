import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
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
  objetoRecibido: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private payPal: PayPal) {
    this.objetoRecibido = navParams.data;
  }


  gotoPay(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AXOJ-mbvqZm9zuD7AHmFaJYOEIM-034qaBQ25vLdJJYfNaKUD0ifi33WtcYI958sHeVA4DHD26-myb_7'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid
    
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
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

  goPremiun() {
    this.navCtrl.push('PremiunPage');
  }

}
