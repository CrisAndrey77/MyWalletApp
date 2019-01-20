import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { UsuariosServicio } from './../services/usuarios.service';
import { Subscription } from 'rxjs/Subscription';

import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {GraficosPage} from '../pages/graficos/graficos';
import {OpcionesPage} from "../pages/opciones/opciones";
import { LoginPage } from "../pages/login/login";
import { VerUsuarioPage } from "../pages/ver-usuario/ver-usuario";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'LoginPage';
  pages: Array<{ title: string, component: any }>;
  usuario:any;
  email:any;
  listaUsuariosSubscription: Subscription;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public menu: MenuController,
    private angularFireAuth: AngularFireAuth,
    private storage: Storage,
    private usuariosServicio: UsuariosServicio) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Inicio', component: 'HomePage'},
      {title: 'Ver Gastos', component: 'VerGastosPage'},
      {title: 'Top 10 categorías', component: 'ListPage'},
      {title: 'Gráficos', component: 'GraficosPage'},
      {title: 'Opciones', component: 'OpcionesPage'}      
    ];

  }

  /* Se encarga de mostrar en el menu desplegable el nombre
  del usuario logeado y su correo */
  cargarNomUsuario(){
    this.storage.get('usuario').then((us) => {  
      this.storage.get('email').then((val) => {
        this.email = val;

        // si existe un nombre de usuario y un email en el local storage,
        // entonces no se hace la consulta a la base de datos.
        // Si no es asi, se recupera el usuario por medio del email
        // y luego de recuperar su nombre, se guarda en el local storage para evitar
        // futuras consultas a la base innecesarias.
        if(!us){

          this.listaUsuariosSubscription =this.usuariosServicio.obtenerUsuarioPorEmail(this.email).snapshotChanges().map(changes => {
            return changes.map(c => ({
              key: c.payload.key, ...c.payload.val()
            }))
          })
          .subscribe(users => {
            this.usuario = users[0].nombre;
            this.storage.set('usuario',this.usuario);
          })
        } else{
          this.usuario = us;
        }
        });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.angularFireAuth.auth.onAuthStateChanged(user => {

        if(user){
          //cada vez que la app se refresque o inicie de nuevo, si el usuario
          //sigue logueado en la app, va a mostrar en el menu desplegable el 
          //nombre y el email
          this.cargarNomUsuario();
        }
      });

      //Hay dos onAuthStateChanged repetidos
      //tuve que hacerlo porque este de abajo no permitia llamar metodos
      this.angularFireAuth.auth.onAuthStateChanged(function (user) {
        if(user){
          this.rootPage = 'HomePage';
        }
        else {
          this.rootPage = 'LoginPage';
        }
      });

      console.log('All set');
      
      /*this.storage.get('premium').then((val) => {
        if(val){
          if(val == true){
            this.admob.banner.hide('ca-app-pub-3940256099942544/6300978111');
          } else{
            this.admob.banner.show({ id: "ca-app-pub-3940256099942544/6300978111" });
          }
        } else{*/
          //this.admob.banner.show({ id: "ca-app-pub-3940256099942544/6300978111" });
        /*}
      });*/
    });
  }


  openPage(page) {
     // close the menu when clicking a link from the menu
     this.menu.close();
     // navigate to the new page if it is not the current page

      this.nav.setRoot(page.component);
  }

  verInfoUsuario(){
    this.menu.close();
    this.nav.push('VerUsuarioPage');
  }
  
  cierraSesion(){
    if(this.listaUsuariosSubscription){
      this.listaUsuariosSubscription.unsubscribe();
    }
    this.menu.close();
    this.nav.setRoot('LogoutPage');
    
    
  }
}
