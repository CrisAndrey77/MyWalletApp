import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public angularFireAuth: AngularFireAuth, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLoad() {
    this.storage.get('email').then((val) => {
      if(val){
        this.navCtrl.setRoot('HomePage',{val});
      }
    });
  }

  register(email,password){
    this.navCtrl.push('RegistrarUsuarioPage');
  }
  
  login(email,password){
    this.storage.set('email', email);
    this.angularFireAuth.auth.signInWithEmailAndPassword(email,password).then((user) => {
      this.navCtrl.setRoot('HomePage',{email});
      this.storage.set('email', email);
    });
  }

}
