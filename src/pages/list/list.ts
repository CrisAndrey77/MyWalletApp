import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage  } from 'ionic-angular';

import { Establecimiento } from '../../app/Clases/Establecimiento';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  selectedItem: any;
  items: Array<{establecimiento:Establecimiento, total:number, categoria:string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.items = [];
    this.items.push({
        establecimiento : new Establecimiento('McDonalds San José', '0' ,50),
        total: 25000,
        categoria: 'Comida'
      });


    this.items.push({
        establecimiento : new Establecimiento('Subway', '0' ,25),
        total: 15000,
        categoria: 'Comida'
      });

    this.items.push({
        establecimiento : new Establecimiento('Taco Bell', '0' ,10),
        total: 3500,
        categoria: 'Comida'
      });

    this.items.push({
        establecimiento : new Establecimiento('NovaCinemas Ciudad del Este', '0' ,15),
        total: 6400,
        categoria: 'Entretenimiento'
      });

    this.items.push({
        establecimiento : new Establecimiento('Cinépolis', '0' ,7),
        total: 3000,
        categoria: 'Entretenimiento'
      });
  }
}