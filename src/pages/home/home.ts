import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import chartJs from 'chart.js';
import { Observable } from 'rxjs/Observable'
import { Gasto } from '../../models/gasto.model'
import { UsuariosServicio } from '../../services/usuarios.service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
 // lineChart: any;
  pieChart: any;
  doughnutChart: any; 

  arrayGastos: Gasto[];
  listaGastosSubscription: Subscription;
  categorias = new Array();
  valores = new Array();
  email:any;

  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public angularFireAuth: AngularFireAuth, private storage: Storage,
    private usuariosServicio: UsuariosServicio) {
    //this.email = navParams.get('email');

    storage.get('email').then((val) => {
      this.email = val;

      this.listaGastosSubscription =this.usuariosServicio.obtenerGastoPorUsuario2(this.email).snapshotChanges().map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      })
      .subscribe(gas => {
        this.arrayGastos = gas;
        
        //Si encuentra una categoria existente en el array, solamente se le suma
        //el dinero al valor de la categoria existente
        for(let g of this.arrayGastos){
          if(this.categorias.indexOf(g.categoria) > -1){
            this.valores[this.categorias.indexOf(g.categoria)] = 
            +this.valores[this.categorias.indexOf(g.categoria)] + +g.valor;
          } else {
            this.categorias.push(g.categoria);
            this.valores.push(+g.valor);
          }
        }
        this.getDoughnutChart();
      })


    });

  }

  openSeachPlaces() {
    this.navCtrl.push('PlacesPage');
  }

  openPremiun(){
    this.navCtrl.push('PremiunPage');
  }

  ngAfterViewInit(){
    setTimeout(()=> {
      //this.pieCanvas = this.getPieChart();
      this.doughnutChart = this.getDoughnutChart();
    }, 250)
  }

    getChart(context, chartType, data, options?){
      return new chartJs(context, {
        data,
        options,
        type: chartType
      })
    }

    getDoughnutChart(){
      const data = {
        labels: this.categorias,
        datasets: [{
          label: 'Prueba Chart',
          data: this.valores,
          backgroundColor: [
            'rgb(0, 244, 97)',
            'rgb(37, 39, 43)',
            'rgb(255, 207, 0)',
            'rgb(240, 150, 20)',
            'rgb(220, 40, 160)',
            'rgb(200, 100, 0)',
            'rgb(180, 130, 100)'
          ]
        }]
      }
      return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
    }
}
