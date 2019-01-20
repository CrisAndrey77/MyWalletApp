import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Gasto } from '../../models/gasto.model';
import { UsuariosServicio } from '../../services/usuarios.service';

/**
 * Generated class for the RegistrarEstablecimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var require: any

@IonicPage()
@Component({
  selector: 'page-registrar-nuevo-establecimiento',
  templateUrl: 'registrar-nuevo-establecimiento.html',
})
export class RegistrarNuevoEstablecimientoPage {

  gasto:Gasto={
    nombre: '',
    email_usuario:'',
    descripcion: '',
    categoria:'',
    valor: 0,
    idEstablecimiento: '',
    fecha: ''
  }

  direccion:any;
  rating:any;

  categorias: any;
  categoria:any;

  autocomplete:any;
  autocompleteItems: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    private usuarioServicio: UsuariosServicio,) {

      this.autocomplete = {
        input: 'restaurant'
      };
      this.autocompleteItems = [];

  }

  ionViewWillLoad() {
    
    /*this.storage.get('place').then((val) => {
      this.place = val;
      console.log(this.place);
      if(val && !val.rating){
        this.place.rating = 'Sin especificar';
      }
      this.categorias = val.types;
    });*/
    
  }

  agregarGasto(gasto:Gasto){
    this.storage.get('email').then((val) => {
      this.gasto.email_usuario = val;
      this.gasto.categoria = this.autocomplete.input
      //this.gasto.idEstablecimiento = this.place.name;
      //this.gasto.categoria = this.categoria;
      //calculando fecha actual
      let dateFormat = require('dateformat');
      let now = new Date();

      this.gasto.fecha=dateFormat(now, "dd, mm, yyyy, h:MM:ss TT"); 
      this.usuarioServicio.agregarGasto(gasto).then(ref => {
        this.navCtrl.setRoot('HomePage');

      });

    });
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
    this.gasto.categoria = item;
    this.autocompleteItems = [];
  }

}
