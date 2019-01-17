import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage, LoadingController, PopoverController} from 'ionic-angular';
import {Gasto} from "../../models/gasto.model";
import {UsuariosServicio} from "../../services/usuarios.service";
import {Storage} from '@ionic/storage';
import {Subscription} from "rxjs";


//Basado en la pagina de graficos para obtener la información.
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  username:any;
  listaGastosSubscription: Subscription;
  arrayGastos: Gasto[] = new Array();
  items: Array<{ categoria: string, valor: number, entrada:number }> = new Array<{categoria: string, valor: number, entrada:number}>();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private usuariosServicio: UsuariosServicio, 
    private storage: Storage,
    public loadingCtrl: LoadingController) {
      this.obtieneArrayGastos();
  }

  obtieneArrayGastos(){
    let carga = this.loadingCtrl.create({
      content: 'Recuperando datos, por favor espere',
    });
    carga.present();
    setTimeout(() =>{
      carga.dismiss();
    }, 5000);
    this.storage.get('email').then(
      (valor) => {
        let email = valor;
        this.username = email;
        this.listaGastosSubscription = this.usuariosServicio.obtenerGastoPorUsuario2(email)
          .snapshotChanges().map(changes => {
            return changes.map(c => ({
              key: c.payload.key, ...c.payload.val()
              }))
          })
          .subscribe(gasto => {
            this.arrayGastos = gasto;             
            this.ordenaListaPorRankingEstablecimiento();
            this.aplicoTamanoLista();
            carga.dismiss();
            })});
            
  }

  ordenaListaPorRankingEstablecimiento() {
    for (let gasto of this.arrayGastos) {
      let tempIndice:number = this.buscoIndiceCategoriaEnLista(this.items, 
        gasto.categoria);
      if (tempIndice > -1) {
        this.items[tempIndice].valor = + this.items[tempIndice].valor + +gasto.valor;
        this.items[tempIndice].entrada = + this.items[tempIndice].entrada + + 1;
      } else {
        this.items.push({
          categoria: gasto.categoria,
          valor: Number(gasto.valor),
          entrada: 1
        })
      }
    }

    
      this.items.sort((categoriaA, categoriaB) => {
        if (categoriaA.valor > categoriaB.valor) {
          return -1;
        }
        if (categoriaA.valor < categoriaB.valor) {
          return 1;
        }
        return 0;
      });
  }

  buscoIndiceCategoriaEnLista(lista, atributoABuscar:string){
    let tamano: number = lista.length;
    for(let i:number = 0; i<tamano; i++){
      if(lista[i].categoria === atributoABuscar){
        return i;
      }
    }
    return -1;
  }

  aplicoTamanoLista(){
    let tamano:number = this.items.length;
    if(tamano > 10){
      this.items = this.items.splice(10, tamano);
    }
  }
}
