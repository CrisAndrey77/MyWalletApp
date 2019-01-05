import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'LoginPage';
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public menu: MenuController,
    private angularFireAuth: AngularFireAuth,
    private storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: 'HomePage'},
      {title: 'List', component: 'ListPage'},
      {title: 'Detalles de la cuenta', component: 'VerUsuarioPage'},
      {title: 'Logout', component: 'LoginPage'},
      //{title: 'Más visitados', component: MasVisitadosPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.angularFireAuth.auth.onAuthStateChanged(function(user) {

        if(user){
          this.rootPage = 'HomePage';
        }
        else {
          this.rootPage = 'LoginPage';
        }
      
      }
      
      );
    });
  }


  openPage(page) {
     // close the menu when clicking a link from the menu
     this.menu.close();
     // navigate to the new page if it is not the current page

     if(page.component == 'LoginPage'){
       this.storage.clear();
       this.angularFireAuth.auth.signOut().then( () => {
        this.nav.setRoot(page.component);
       });
     } else {
      this.nav.setRoot(page.component);
     }
  }
}
