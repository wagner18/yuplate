import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Geolocation } from 'ionic-native';

import { MapOptions } from './map-options';

declare var google;


@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html'
})
export class LocationModalPage {

	public address: any = {}; 
	public data: any;
	public baseMap: any;
	
	public autocompleteItems;
  public autocomplete;
  public service = new google.maps.places.AutocompleteService();

	@ViewChild('map') mapElement: ElementRef;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams
  ){ 
  	this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    this.address = this.params.get('data');

    console.log(this.address);

    this.autocomplete.query = this.address.address;

    //var options = {timeout: 10000, enableHighAccuracy: true};
    let center = { lat: 38.046386, lng: -87.551769 }
    this.baseMap = this.createMap(this.address.geolocation);
    
  }

  dismiss() {
		this.viewCtrl.dismiss(this.address);
	}

    // Create an new google maps
  createMap(center){

  	let latLng = new google.maps.LatLng(center.lat, center.lng);
  	// let map_options = new MapOptions();

    let mapOptions = {
      center: latLng,
      maxZoom: 20,
      minZoom: 3,
      //scrollwheel: false,
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      // styles: map_options.map_style
    };

    let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    map.setZoom(12);
    return map;
  }

  findMe(){
  	Geolocation.getCurrentPosition({ maximumAge: 5000, timeout: 15000, enableHighAccuracy: true }).then((position) => {

  		let current_location = { lat: position.coords.latitude, lng: position.coords.longitude };
  		let marker = this.addMarker();
  		marker.setPosition(current_location);
  		this.baseMap.setCenter(current_location);
	  	this.baseMap.setZoom(18);
  		this.address.geolocation = current_location;

  		let geo = new google.maps.Geocoder;
			geo.geocode({location: current_location}, (results, status) => {
				if (status === 'OK') {
					this.address.address = results[0].formatted_address;
					this.autocomplete.query = results[0].formatted_address;
				}
			});

    }, (error) => {
      console.log(error);
      alert("We couldn't get your location, please check your internet.");
    });
  }
  

  addMarker(){
	  let marker = new google.maps.Marker({
	    map: this.baseMap,
	    animation: google.maps.Animation.DROP,
	  });
	  // this.baseMap.setCenter(marker.getPosition());
	  // let content = "<h4>Information!</h4>";
	 	return marker;
	}

	addInfoWindow(marker, content){
 
	  let infoWindow = new google.maps.InfoWindow({
	    content: content
	  });
	  google.maps.event.addListener(marker, 'click', () => {
	    infoWindow.open(this.baseMap, marker);
	  });
	 
	}

	/**
  * Update the search on ioninput event with google prediction
  */
  updateSearch() {
  	if(this.autocomplete.query.trim().length > 6){
	    if(this.autocomplete.query == '') {
	      this.autocompleteItems = [];
	      return;
	    }
	    this.service.getPlacePredictions({ input: this.autocomplete.query}, (predictions, status) => {
	      this.autocompleteItems = [];
	      this.autocompleteItems = predictions;
	      // predictions.forEach(function (prediction) {
	      //   this.autocompleteItems.push(prediction);
	      // });
	    });
  	}
  }

  /**
  * Process the object choosed from a location search or google prediction
  *	@param {object} address Object from a google prediction service
  */
  chooseAddress(address){
  	this.autocompleteItems = [];
  	this.autocomplete.query = address.description;
  	this.address.address = address.description;

  	let geo = new google.maps.Geocoder;
		geo.geocode({placeId: address.place_id}, (results, status) => {

			this.address.geolocation = {
				lat: results[0].geometry.location.lat(),
				lng: results[0].geometry.location.lng()
			}

			let marker = this.addMarker();
			marker.setPlace({ 
				placeId: address.place_id,
				location: results[0].geometry.location 
			});
	    marker.setVisible(true);
	    this.baseMap.setCenter(results[0].geometry.location);
	  	this.baseMap.setZoom(18);
		});
  }

}
