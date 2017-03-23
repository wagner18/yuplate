import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams, Slides} from 'ionic-angular';

//import 'rxjs/Rx';

import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { ItemModel } from '../../models/listing-model';

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

  public categories: any;
  public list_limit: number = 10;
  public listings: ItemModel[];

  public search_query: string;

  public categories_checkbox_open: boolean;
  public categories_checkbox_result;

  public active_button: Array<any> = ["head-active-button", "", "", "", ""];

  constructor(
    public nav: NavController,
    public listingService: ListingService,
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
    this.categories = this.listingService.getListingType();

    this.getItems();
  }

  ngOnDestroy() {
    // the .nativeElement property of the ViewChild is the reference to the <video> 
    console.log('ON DESTROY LISTING!');
    // this._img.nativeElement.src = '';
    // this._img.nativeElement.load();
  }

  private getItems(){
    var self = this;

    let query = {
        limitToFirst:5,
        orderByKey: true
    };
    this.loading.present();

    // Set query configurations
    let listing_ref = this.listingService.listListing(query)
    .orderByChild('created_at');
    // .equalTo('true', 'active');
    //.limitToLast(this.list_limit);


    listing_ref.on('value', (listingSnap) => {
      let objects = listingSnap.val();

      this.listings = Object.keys(objects).map(function (key) {

        /* get the prorile for each listing */
        self._profileService.getShortPrifile(objects[key].uid)
        .once('value', profileSnap => {
          if(profileSnap.val()){
            objects[key].profile = profileSnap.val();
          }
        },
        function(error){
          console.log(error);
        });

        objects[key].listing_key = key;
        return objects[key]; 
      });

      this.listings.reverse();

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
  *
  */
  listingDetails(index){
    console.log(this.listings[index]);

    this.nav.push(ListingDetailsPage, { listing: this.listings[index]});
  }

  listingType(item){
    console.log(item);

    this.active_button = this.active_button.map(function(value, index) {
      return null;
    });

    this.active_button[item] = "head-active-button";
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
  updateSearch($event) {
    console.log("search query = ",this.search_query);
  }

  /**
  * Applay Category filter
  */
  setCategoryFilter(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Categories');

    let categories = this.listingService.getListingCategories();
    categories.map((category)=>{
      alert.addInput({
        type: 'checkbox',
        label: category.label,
        value: category.value
      });
    });


    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }


  doInfinite(infiniteScroll) {
    console.log('Begin async operation', infiniteScroll);

    this.list_limit = this.list_limit + 10;
    //this.getItems();

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }


}
