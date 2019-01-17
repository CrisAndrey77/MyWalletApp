import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import chartJs from 'chart.js';
import { Observable } from 'rxjs/Observable'
import { Gasto } from '../../models/gasto.model'
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the GraficosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graficos',
  templateUrl: 'graficos.html',
})
export class GraficosPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  lineChart: any;
  pieChart: any;
  doughnutChart: any; 

  arrayGastos: Gasto[];
  listaGastosSubscription: Subscription;
  categorias = new Array();
  valores = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private usuariosServicio: UsuariosServicio,
    private storage: Storage) {
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad GraficosPage');
    var email;
    this.storage.get('email').then((val) => {
      email = val;

      this.listaGastosSubscription =this.usuariosServicio.obtenerGastoPorUsuario2(email).snapshotChanges().map(changes => {
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
        this.getBarChart();
        this.getPieChart(); // AQUI
        this.getDoughnutChart();
       // this.getLineChart();
      })


    });
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.barChart = this.getBarChart();
      //this.lineChart = this.getLineChart();
    }, 150)

    setTimeout(()=> {
      this.pieCanvas = this.getPieChart();
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

    getBarChart(){
      const data = {
        labels: this.categorias,
        datasets: [{
          label: 'Gastos Realizados',
          data: this.valores,
          backgroundColor: [
            'rgb(255,0,0)',
            'rgb(20,0,255)',
            'rgb(255,230,0)',
            'rgb(0,255,10)',
            'rgb(60,0,70)',
          ],
          borderWidth: 1
        }]
      };
      const options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
      return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
    }


  
  /*  getLineChart(){
      const data = {
        labels: this.categorias,
        datasets: [{
          label: 'Menu Dataset',
          fil: false,
          lineTension : 0.1,
          backgroundColor: 'rgb(0,170,255)',
          borderColor: 'rgb(231, 205, 35)',
          borderCapStyle: 'butt',
          borderJoinStyle: 'miter',
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.valores,
          scanGaps: false,          
        },{
          label: 'Menu Segundo Dataset',
          fil: false,
          lineTension : 0.1,
          backgroundColor: 'rgb(117,0,49)',
          borderColor: 'rgb(51, 50, 46)',
          borderCapStyle: 'butt',
          borderJoinStyle: 'miter',
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.valores,
          scanGaps: false,    
        }
      ]
      }
      return this.getChart(this.lineCanvas.nativeElement, 'line', data);
    }
*/
    getPieChart(){
      const data = {
        labels: this.categorias,
        datasets: [{
          data: this.valores,
          backgroundColor: [        
          'rgb((0, 0, 255))',
          'rgb(255,0,0)',
          'rgb(20,0,255)',
          'rgb(255,230,0)',
          'rgb(0,255,10)',
          'rgb(60,0,70)',]
      }]
    }
    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }


  getDoughnutChart(){
    const data = {
      labels: this.categorias,
      datasets: [{
        label: 'Prueba Chart',
        data: this.valores,
        backgroundColor: [
          'rgb(60,0,70)',
          'rgb(255,0,0)',
          'rgb(20,0,255)',
          'rgb(255,230,0)',
          'rgb(0,255,10)',
          'rgb(60,0,70)',
        ]
      }]
    }
    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }
}
