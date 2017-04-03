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

  public classification_checkbox_open: boolean;
  public classification_checkbox_result;

  public active_button: Array<any> = ["", "", ""];

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
  *
  */
  listingDetails(index){
    console.log(this.listings[index]);
    this.nav.push(ListingDetailsPage, { listing: this.listings[index]});
  }

  listingType(item){

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
  onSearch($event) {
    console.log("search query = ",this.search_query);

      let load = this.loadingCtrl.create();
      load.present();
        this.listings.sort(function(){return 0.5 - Math.random()});
      load.dismiss();

    this.keyboard.close();
  }

  /**
  * Applay classification filter
  */
  setClassificationFilter(){
    let alert = this.alertCtrl.create({
      cssClass: 'classification-prompt'
    });
    alert.setTitle('Listing Type');

    alert.addInput({
      type: 'checkbox',
      label: 'All',
      value: 'All',
      checked: true
    });

    let classifications = this.listingService.getClassification();
    classifications.map((classification)=>{
      alert.addInput({
        type: 'checkbox',
        label: classification.label,
        value: classification.value
      });
    });


    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.classification_checkbox_open = false;
        this.classification_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.classification_checkbox_open = true;
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
