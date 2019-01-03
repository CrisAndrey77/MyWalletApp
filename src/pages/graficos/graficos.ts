import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import chartJs from 'chart.js';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraficosPage');
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.barChart = this.getBarChart();
      this.lineChart = this.getLineChart();

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
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [{
          label: 'numero de votos',
          data: [12, 4, 23, 15, 90, 15],
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


  
    getLineChart(){
      const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
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
          data: [20, 15, 98, 4],
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
          data: [29, 135, 13, 70],
          scanGaps: false,    
        }
      ]
      }
      return this.getChart(this.lineCanvas.nativeElement, 'line', data);
    }

    getPieChart(){
      const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          data: [300, 75, 224],
          backgroundColor: ['rgb(200, 6, 0)', 'rgb(36, 0, 255)', 'rgb(242, 255, 0)']
      }]
    }
    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }


  getDoughnutChart(){
    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        label: 'Prueba Chart',
        data: [12, 65, 32],
        backgroundColor: [
          'rgb(0, 244, 97)',
          'rgb(37, 39, 43)',
          'rgb(255, 207, 0)'
        ]
      }]
    }
    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }

}
