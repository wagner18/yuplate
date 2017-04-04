import { Component, OnInit, OnDestroy } from '@angular/core';
import { Keyboard, NavController, ModalController, AlertController, LoadingController, NavParams, Slides} from 'ionic-angular';

//import 'rxjs/Rx';

import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { ListItemService } from '../../providers/list-item.service';
import { ListingModel } from '../../models/listing-model';

import { LocationModalPage, } from '../location-modal/location-modal';
import { ListingFilterPage } from '../listing-filter/listing-filter';
import { ListingDetailsPage } from '../listing-details/listing-details';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html'
})
export class ListingPage implements OnDestroy{
  
  public slideOptions = {pager: true};

  public loading: any;
  public current_time = new Date();

  public list_limit: number = 10;
  public listings: any;

  public search_query: string;
  public section_title: string = "";

  constructor(
    public keyboard: Keyboard,
    public nav: NavController,
    public listingService: ListingService,
    public itemService: ListItemService,
    public params: NavParams,
    private _profileService: ProfileService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ){

    console.log("View Controller in Stake >>> ", this.nav.length());
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
   this.getItems();
  }

  ngOnDestroy() {
    // the .nativeElement property of the ViewChild is the reference to the <video> 
    // console.log('ON DESTROY LISTING!');
    // this._img.nativeElement.src = '';
    // this._img.nativeElement.load();
  }

  /**
  * @param = limit - define the listing limit
  */
  private getItems(limit = 10){

    // Set the section title
    this.section_title = "Most Popular";

    // Set query configurations
    this.listings = [];

    let listings_ref = this.itemService.listItems()
    .orderByChild('search_tags')
    .limitToLast(limit);
    // .equalTo('true', 'active');

    listings_ref.on('value', (listingSnap) => {

      let data = listingSnap.val();

      Object.keys(data).map(key => {
        this.listings.push(data[key]);
      })
      //this.loading.dismiss();
    }, error =>{
      console.log(error);
    });

  }

  /**
  *
  */
  getLocalItems(){

    // Set the section title
    this.section_title = "Yuplate Local";

    this.loading.present();
    this.listings = [];
    this.itemService.getLocalItems(25).then( listings => {

      console.log(listings);
      this.listings = listings;

      this.loading.dismiss();
    });
  }

  /**
  *
  */
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  /**
  * Show the details of a item
  * @param = key - Item key
  */
  listingDetails(key){
    console.log(this.listings[key]);
    this.nav.push(ListingDetailsPage, { listing: this.listings[key]});
  }

  /**
  * Show the Location modal
  */
  locationModalPage() {
    let locationModal = this.modalCtrl.create(LocationModalPage);
    locationModal.onDidDismiss(data => {

      let load = this.loadingCtrl.create();
      load.present();
        this.listings.sort(function(){return 0.5 - Math.random()});
      load.dismiss();

      console.log(this.listings, data);
      // if(data.location.geolocation){
      // }
    });
    locationModal.present();
  }

  /**
  * Show the Filter Modal
  */
  filterModalPage() {
    let filterModal = this.modalCtrl.create(ListingFilterPage);
    filterModal.onDidDismiss(data => {

      let load = this.loadingCtrl.create();
      load.present();
        this.listings.sort(function(){return 0.5 - Math.random()});
      load.dismiss();
    });
    filterModal.present();
  }

  /**
  * @param event - The input event from the search bar
  */
  onSearch($event) {
    console.log("search query = ",this.search_query);

      let load = this.loadingCtrl.create();
      load.present();
        this.listings.sort(function(){return 0.5 - Math.random()});
      load.dismiss();

    this.keyboard.close();
  }

  /**
  *
  */
  doInfinite(infiniteScroll) {
    console.log('Begin async operation', infiniteScroll);

    this.list_limit = this.list_limit + 10;
    //this.getItems();

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }


}
