import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;


@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html'
})
export class LocationModalPage {

  public data: any = {};
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
    let data = this.params.get('data');
    var geo_position = {};
    
      if(data!== undefined && 'lat' in data.location.geolocation) {
        geo_position = data.location.geolocation;
        this.autocomplete.query = data.location.address;
        this.data = data;
      }else{
        geo_position = { lat: 38.046386, lng: -87.551769 };
        this.data = {location: geo_position};
      }


    this.baseMap = this.createMap(geo_position);
  }


  /**
  * Dismiss the Location Modal and retrive the data to the caller
  */
  dismiss() {

    //Set the form controler return to the listing form 
    // if being used for the listing form
    if(this.data.form_control !== undefined){
      if(this.autocomplete.query){
        this.data.form_control.location = true;
      }else{
        this.data.form_control.location = false;
      }
    }

    this.viewCtrl.dismiss(this.data);
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

      var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.6,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.25,
        map: map,
        center: latLng,
        radius: 4000
      });

    return map;
  }

  findMe(){
  	Geolocation.getCurrentPosition({ maximumAge: 5000, timeout: 15000, enableHighAccuracy: true }).then((position) => {

  		let current_location = { lat: position.coords.latitude, lng: position.coords.longitude };
  		let marker = this.addMarker();
  		marker.setPosition(current_location);

  		this.baseMap.setCenter(current_location);
	  	this.baseMap.setZoom(13);
  		this.data.location.geolocation = current_location;

  		let geo = new google.maps.Geocoder;
			geo.geocode({location: current_location}, (results, status) => {
				if (status === 'OK') {
					this.data.location.address = results[0].formatted_address;
					this.autocomplete.query = results[0].formatted_address;
				}
			});

    }, (error) => {
      console.log(error);
      alert("We couldn't get your location, please check your internet.");
    });
  }
  
  /**
  *
  */
  addMarker(){
	  let marker = new google.maps.Marker({
	    map: this.baseMap,
	    animation: google.maps.Animation.DROP,
	  });
	  // this.baseMap.setCenter(marker.getPosition());
	  // let content = "<h4>Information!</h4>";
	 	return marker;
	}

  /**
  * Add information content to the specific marker
  * @param marker - the google marker which will host the information
  * @param content - gogole informatio content
  */
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
  	this.data.location.address = address.description;

  	let geo = new google.maps.Geocoder;
		geo.geocode({placeId: address.place_id}, (results, status) => {

			this.data.location.geolocation = {
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
	  	this.baseMap.setZoom(12);
		});
  }

}
