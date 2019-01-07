import {Component} from '@angular/core';
import {NavController, NavParams, IonicPage} from 'ionic-angular';
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
  categorias = new Array();
  establecimientos = new Array();
  valores = new Array();
  listaGastosSubscription: Subscription;
  arrayGastos: Gasto[];
  items: Array<{ establecimiento: string, categoria: string, valor: number }> = new Array<{establecimiento: string, categoria: string, valor: number}>();

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private usuariosServicio: UsuariosServicio, private storage: Storage) {
    this.storage.get('email').then((valor) => {
      let email = valor;

      this.listaGastosSubscription = this.usuariosServicio.obtenerGastoPorUsuario2(email)
        .snapshotChanges().map(changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }))
        })
        .subscribe(gasto => {
          this.arrayGastos = gasto;

          //Si encuentra una categoria existente en el array, solamente se le suma
          //el dinero al valor de la categoria existente
          for (let gasto of this.arrayGastos) {
            this.categorias.push(gasto.categoria);
            if (this.establecimientos.indexOf(gasto.idEstablecimiento) > -1) {
              this.valores[this.establecimientos.indexOf(gasto.idEstablecimiento)] =
                +this.valores[this.establecimientos.indexOf(gasto.idEstablecimiento)] + +gasto.valor;
            } else {
              this.establecimientos.push(gasto.idEstablecimiento);
              this.valores.push(+gasto.valor);
            }
            let tamano: number = this.establecimientos.length;
            for (let i: number = 0; i < tamano && i < 10; i++) {
              this.items.push({
                establecimiento: this.establecimientos[i],
                categoria: this.categorias[i],
                valor: this.valores[i]
              });
            }
          }
        })
    });

  }


}
