import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import chartJs from 'chart.js';
import { Observable } from 'rxjs/Observable'
import { Gasto } from '../../models/gasto.model'
import { UsuariosServicio } from '../../services/usuarios.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { AlertController } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { AngularFireAction } from 'angularfire2/database';

/**
 * Generated class for the GraficosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
declare var require: any

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
  categorias_barra = new Array();
  valores_barra = new Array();
  categorias_pie = new Array();
  valores_pie = new Array();
  array_valores = new Array();
  array_categorias = new Array();
  fecha_actual= new Date();
  fecha_ayer = new Date();
  fecha_inicial = new Date();
  fecha_final = new Date();

  autocomplete:any;
  autocompleteItems: any;


  private dateFromBarra:String;
  private dateToBarra:String;

  private dateFromPie:String;
  private dateToPie:String;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private usuariosServicio: UsuariosServicio,
    private storage: Storage,
    private alertCtrl: AlertController) {

      this.autocomplete = {
        input: 'restaurant'
      };
      this.autocompleteItems = [];

      this.aplicarFechasIniciales();
      
  }

  aplicarFechasIniciales(){
    this.fecha_actual = new Date();

    //calculando fecha actual
    let dateFormat = require('dateformat');
    let now = new Date();

    this.fecha_actual = new Date();
    this.fecha_ayer.setDate(this.fecha_actual.getDate() - 30);

    var fecha_format_hoy=dateFormat(now, "yyyy-mm-dd"); 
    var fecha_format_ayer=dateFormat(this.fecha_ayer, "yyyy-mm-dd");

    this.dateFromPie = fecha_format_ayer;
    this.dateToPie = fecha_format_hoy;

    this.dateFromBarra = fecha_format_ayer;
    this.dateToBarra = fecha_format_hoy;

    this.fecha_inicial = this.transformarDateAString(this.dateFromBarra);
    this.fecha_final = this.transformarDateAString(this.dateToBarra);
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
      .subscribe(gast => {
        this.arrayGastos = gast;
        
        // utilizo los mismos arrays de categorias y valores
        // solamente al principio, para inicializar los graficos
        this.categorias_barra = [];
        this.valores_barra = [];
        this.actualizarDiasBarra();
        this.cargarDatosBarra(this.categorias_barra,this.valores_barra);
        this.InitGraficoBarra();

        this.categorias_pie = [];
        this.valores_pie = [];
        this.actualizarDiasPie();
        this.cargarDatosPie(this.categorias_pie,this.valores_pie);
        this.InitGraficoPie();
        console.log();

      })
    });
  }

  /* ES IMPORTANTE QUE, CUANDO SE ABANDONE LA PAGINA,
  SE DESUSCRIBA DE LA CONSULTA A LA BASE DE DATOS, PARA QUE NO HAYAN ERRORES
  AL DESLOGEARSE DE LA APLICACION*/
  ionViewWillLeave(){
    this.listaGastosSubscription.unsubscribe();
  }


  cargarDatosBarra(array_labels, array_datos){
    
    //Si encuentra una categoria existente en el array, solamente se le suma
        //el dinero al valor de la categoria existente
        for(let g of this.arrayGastos){
          // verifica si la fecha del gasto es menor o igual a la fecha inicial
          // o a la fecha final seleccionada por el usuario
          if(this.filtrarFechas(g)){

          if(array_labels.indexOf(g.categoria) > -1){
            array_datos[array_labels.indexOf(g.categoria)] = 
            +array_datos[array_labels.indexOf(g.categoria)] + +g.valor;
          } else {
            array_labels.push(g.categoria);
            array_datos.push(+g.valor);
          }
        }
      }

  }

  cargarDatosPie(array_labels, array_datos){
    
    //Si encuentra una categoria existente en el array, solamente se le suma
        //el dinero al valor de la categoria existente
        for(let g of this.arrayGastos){
          if(g.categoria==this.autocomplete.input){

            // verifica si la fecha del gasto es menor o igual a la fecha inicial
            // o a la fecha final seleccionada por el usuario
            if(this.filtrarFechas(g)){
              array_labels.push(g.nombre);
              array_datos.push(+g.valor);
          }

        }
      }

  }
  
  // verifica si la fecha del gasto es menor o igual a la fecha inicial
  // o a la fecha final seleccionada por el usuario
  filtrarFechas(gasto){
      var strFecha = gasto.fecha.split(", ",3 );
      var dia = strFecha[0];
      var mes = strFecha[1];
      var anno = strFecha[2];

      // en el parametro de mes, enero empieza con 00, febrero con 01
      var fecha_gasto = new Date(+anno,+mes - 1,+dia);

      if(this.fecha_inicial <= fecha_gasto && this.fecha_final >= fecha_gasto){
        console.log(fecha_gasto + " + " + gasto.descripcion + " " + gasto.categoria);
        return true;
      } else{
        return false;
      }

  }

  transformarDateAString(fecha){
    var strFecha = fecha.split("-",3 );
    var dia = strFecha[2];
    var mes = strFecha[1];
    var anno = strFecha[0];

    var fecha_seleccionada = new Date(+anno,+mes - 1,+dia);
    return fecha_seleccionada;

  }

  actualizarGraficoBarra(){
    this.array_categorias = [];
    this.array_valores = [];
    this.actualizarDiasBarra();
    console.log("diferencia de dias = " +  this.diferenciaDias());
    this.actualizarGrafico(this.barChart, "barra");
  }

  actualizarGraficoPie(){
    this.array_categorias = [];
    this.array_valores = [];
    this.actualizarDiasPie();
    console.log("diferencia de dias = " +  this.diferenciaDias());
    this.actualizarGrafico(this.pieChart, "pie");
  }

  actualizarGrafico(grafico, nombre_grafico){

    if(this.diferenciaDias()<=31){
      switch(nombre_grafico) {
        case "barra": { 
          //carga los datos a arreglos para el grafico de barra
          this.cargarDatosBarra(this.array_categorias,this.array_valores);
          break; 
        }
        case "pie": {
          //carga los datos a arreglos para el grafico de pie
          this.cargarDatosPie(this.array_categorias,this.array_valores);
          break; 
        }
      }

      //limpia el grafico 
      this.removerDatos(grafico);
      //agrega nuevos datos
      this.agregarDatos(grafico, this.array_categorias,this.array_valores);

    } else{
      this.presentConfirm();
    }
  }

  actualizarDiasBarra(){
    this.fecha_inicial = this.transformarDateAString(this.dateFromBarra);
    this.fecha_final = this.transformarDateAString(this.dateToBarra);
  }

  actualizarDiasPie(){
    this.fecha_inicial = this.transformarDateAString(this.dateFromPie);
    this.fecha_final = this.transformarDateAString(this.dateToPie);
  }

  diferenciaDias() {
    var dt1 = this.fecha_inicial;
    var dt2 = this.fecha_final;
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  removerDatos(chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = []
    });
    chart.update();
  }

  agregarDatos(chart, label, data) {
    chart.data.labels = label
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
  }
  
  // antes se llamaba   ngAfterViewInit
  graficosInit(){
    setTimeout(()=>{
      this.barChart = this.getBarChart();
      //this.lineChart = this.getLineChart();
    }, 150)

    setTimeout(()=> {
      this.pieCanvas = this.getPieChart();
      //this.doughnutChart = this.getDoughnutChart();
    }, 250)
  }
    getChart(context, chartType, data, options?){
      return new chartJs(context, {
        data,
        options,
        type: chartType
      })
    }

    InitGraficoBarra(){
      setTimeout(()=>{
        this.barChart = this.getBarChart();
        //this.lineChart = this.getLineChart();
      }, 150)
    }

    InitGraficoPie(){
      setTimeout(()=> {
        this.pieChart = this.getPieChart();
      }, 150)
    }

    getBarChart(){
      const data = {
        labels: this.categorias_barra,
        datasets: [{
          label: 'Gastos Realizados',
          data: this.valores_barra,
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
        maintainAspectRatio: false,
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
        labels: this.categorias_pie,
        datasets: [{
          data: this.valores_pie,
          backgroundColor: [        
          'rgb((0, 0, 255))',
          'rgb(255,0,0)',
          'rgb(20,0,255)',
          'rgb(255,230,0)',
          'rgb(0,255,10)',
          'rgb(60,0,70)',]
      }]
    }

    var options = {
      maintainAspectRatio: false,
      
    };
    return this.getChart(this.pieCanvas.nativeElement, 'pie', data, options);
  }


  /*getDoughnutChart(){
    const data = {
      labels: this.categorias_pie,
      datasets: [{
        label: 'Prueba Chart',
        data: this.valores_pie,
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

    
    var options = {
      maintainAspectRatio: false,
      
    };
    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data, options);
  }*/

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Caracteristica Premium',
      message: 'Para ver tus gastos de hace más de dos meses'
      +' necesitas una suscripcion Premium. ¿Deseas una?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ver planes',
          handler: () => {
            console.log('Buy clicked');
            this.navCtrl.push("PremiunPage")
          }
        }
      ]
    });
    alert.present();
  }

  updateSearchResults(){

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
      this.autocompleteItems = ['accounting','airport','amusement_park','aquarium','art_gallery','atm',
      'bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','café','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery',
      'church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','fire_station','florist','funeral_home','furniture_store',
      'gas_station','gym','hair_care','hardware_store','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office','locksmith',
      'lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking',
      'pet_store','pharmacy','physiotherapist','plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school','shoe_store','shopping_mall',
      'spa','stadium','storage','store','subway_station','supermarket','synagogue','taxi_stand','train_station','transit_station','travel_agency','veterinary_care','zoo',
      'administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','administrative_area_level_4','administrative_area_level_5','colloquial_area','country',
      'establishment','finance','floor','food','general_contractor','geocode','health','intersection','locality','natural_feature','neighborhood','place_of_worship','political',
      'point_of_interest','post_box','postal_code','postal_code_prefix','postal_code_suffix','postal_town','premise','room','route','street_address','street_number','sublocality','sublocality_level_4',
      'sublocality_level_5','sublocality_level_3','sublocality_level_2','sublocality_level_1','subpremise'
      ];

      var arrayAux = [];

      for(let a of this.autocompleteItems){
        if(a.includes(this.autocomplete.input)){
          arrayAux.push(a);
        }
      }

      this.autocompleteItems = arrayAux;
      
  }

  selectSearchResult(item){
    console.log(item);
    this.autocomplete.input = item;
    this.actualizarGraficoPie();
  }
}
