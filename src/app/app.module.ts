import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';


import {AngularFireModule} from 'angularfire2'
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {AngularFireAuthModule} from 'angularfire2/auth'
import {AngularFireAuth} from 'angularfire2/auth'
import {FIREBASE_CONFIG} from './firebase.credentials'

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { UsuariosServicio } from '../services/usuarios.service';
import { IonicStorageModule } from '@ionic/storage';
//import {MasVisitadosPage} from "../pages/mas-visitados/mas-visitados";
//import {ProviderUsuarioProvider} from '../providers/provider-usuario/provider-usuario';

@NgModule({
  declarations: [
    MyApp,
    //MasVisitadosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    //MasVisitadosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //ProviderUsuarioProvider
    AngularFireAuth,
    UsuariosServicio
  ]
})
export class AppModule {}
