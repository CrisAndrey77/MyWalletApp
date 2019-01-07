import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  email:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public angularFireAuth: AngularFireAuth, private storage: Storage) {
    //this.email = navParams.get('email');

    storage.get('email').then((val) => {
      this.email = val;
    });

  }

  openSeachPlaces() {
    this.navCtrl.push('PlacesPage');
  }

  openPremiun(){
    this.navCtrl.push('PremiunPage');
  }
}
