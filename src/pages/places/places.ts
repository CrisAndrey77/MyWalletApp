import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;
@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {

  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  nearbyItems: any = new Array<any>();
  loading: any;
  position:any;
  place:any;
  radio:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public zone: NgZone,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    private storage: Storage,
    private loadingController:LoadingController) {
      this.radio = '1000';
      this.loading = this.loadingController.create({
        content: 'Cargando establecimientos, por favor espere',
      });
      this.loading.present();
      setTimeout(() =>{
        this.loading.dismiss();
      }, 15000);
      this.geocoder = new google.maps.Geocoder;
      let elem = document.createElement("div")
      this.GooglePlaces = new google.maps.places.PlacesService(elem);
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = {
        input: ''
      };
      this.autocompleteItems = [];


      this.geolocation.getCurrentPosition().then((resp) => {
        let pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };
        
        this.position = pos;



        this.GooglePlaces.nearbySearch({
        location: this.position,
        radius: this.radio,
        types: ['restaurant'], //check other types here https://developers.google.com/places/web-service/supported_types
        key: 'AIzaSyBlWeLtK5QpzOMvKF7M1s-f9a7HWHQUHlY'
      }, (near_places) => {
        this.zone.run(() => {
          this.nearbyItems = [];
          for (var i = 0; i < near_places.length; i++) {
            this.nearbyItems.push(near_places[i]);
          }
          this.loading.dismiss();
        });
      })
  
      }).catch((error) => {
        console.log('Error getting location', error);
        this.loading.dismiss();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
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
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() =>{
      this.loading.dismiss();
    }, 500);
    this.autocompleteItems = [];
   
        this.GooglePlaces.nearbySearch({
          location: this.position,
          radius: this.radio,
          types: [item], //check other types here https://developers.google.com/places/web-service/supported_types
          key: 'AIzaSyBlWeLtK5QpzOMvKF7M1s-f9a7HWHQUHlY'
        }, (near_places) => {
          this.zone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
          });
        })
      }

  registrarEstablecimiento(place){
        var lugar = {
          name : place.name,
          vicinity : place.vicinity,
          rating : place.rating,
          types: place.types
        }
        this.storage.set('place', lugar);
        this.navCtrl.push('RegistrarEstablecimientoPage');
  }

  abrirRegistrarNuevo(){
    this.navCtrl.push('RegistrarNuevoEstablecimientoPage');
  }


  /*selectSearchResult(item){
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.autocompleteItems = [];
        this.GooglePlaces.nearbySearch({
          location: this.position,
          radius: '1000',
          types: ['restaurant'], //check other types here https://developers.google.com/places/web-service/supported_types
          key: '-'
        }, (near_places) => {
          this.zone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
            this.loading.dismiss();
          });
        })
      }
    })
  }*/


  /*updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }*/

}
