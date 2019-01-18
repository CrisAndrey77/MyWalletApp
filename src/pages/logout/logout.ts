import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {AngularFireAuth} from 'angularfire2/auth';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private angularFireAuth: AngularFireAuth,
    private storage: Storage) {

    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');


    this.angularFireAuth.auth.signOut().then( () => {
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
     });
  }

}
