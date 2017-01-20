import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';

import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { ItemModel } from '../../models/listing-model';

import { ListingOrderPage } from '../listing-order/listing-order';
import { ImageViewModalPage } from '../image-view-modal/image-view-modal';


declare var google;

@Component({
  selector: 'page-listing-details',
  templateUrl: 'listing-details.html'
})
export class ListingDetailsPage {

	public listing: any;
	public listing_ref: string;
  public total_reviews: number;

  @ViewChild('map') mapElement: ElementRef;

  constructor(
  	public nav: NavController,
    public modalCtrl: ModalController,
  	public params: NavParams,
  	public listingService: ListingService,
  	private _profileService: ProfileService,
  ) {}

  ionViewWillLoad() {
    // Get the Listing Key Reference form the nav params
    this.listing = this.params.get('listing');
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",this.listing);

    if(this.listing.reviews !== undefined ){
       this.total_reviews = this.listing.reviews.lenght;
    }else{
      this.total_reviews = 0;
    }

  }

  ionViewDidLoad() {
    if(this.listing.location.geolocation !== undefined ){
      this.createMap(this.listing.location.geolocation);
    }
  }

  private getItem(){
    var self = this;
    this.listingService.getListing(this.listing_ref)
    .once('value', (listingSnap) => {
   
      this.listing = listingSnap.val();

      /* get the prorile for each listing */
      self._profileService.getShortPrifile(this.listing.uid)
      .once('value', profileSnap => {
        if(profileSnap.val()){
          this.listing.profile = profileSnap.val();
        }
      },
      function(error){
        console.log(error);
      });

    });

  }

  // Create an new google maps
  private createMap(position) {

    console.log(position);

    //let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: position,
      draggable: false,
      maxZoom: 10,
      minZoom: 10,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    
    let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    map.setZoom(10);

    let marker = new google.maps.Marker({
      position: position,
      map: map,
      title: 'Location'
    });

  }

  shareListing(){
    console.log("share it!");
  }

  setAsFavorite(){
    console.log("Set as a favorite");
  }

  showReviews(){
    console.log("Show Reviews");
  }

  /**
  * Handle the Image Modal
  */
  presentOrderModal() {
    let orderModal = this.modalCtrl.create(ListingOrderPage, { listing: this.listing });
    orderModal.present();
  }

  /**
  * Handle the Image Modal
  */
  presentImageModal() {
    let imageModal = this.modalCtrl.create(ImageViewModalPage, { medias: this.listing.medias });
    imageModal.present();
  }

}