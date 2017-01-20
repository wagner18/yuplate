import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, NavParams, Slides} from 'ionic-angular';

import { FeedPage } from '../feed/feed';
//import 'rxjs/Rx';

import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { ItemModel } from '../../models/listing-model';

import { ListingDetailsPage } from '../listing-details/listing-details';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html'
})
export class ListingPage implements OnDestroy{
  
  public slideOptions = {pager: true};
  public loading: any;

  public list_limit: number = 10;
  public listings: ItemModel[];

  public active_button: Array<any> = ["head-active-button", "", "", "", ""];

  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public params: NavParams,
    private _profileService: ProfileService,
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
    this.listingService.listListing(query).limitToLast(this.list_limit)
    .on('value', (listingSnap) => {
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

      this.loading.dismiss();
    });

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


  doInfinite(infiniteScroll) {
    console.log('Begin async operation', infiniteScroll);

    this.list_limit = this.list_limit + 10;
    //this.getItems();

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }


  goToFeed(category: any) {
    this.nav.push(FeedPage, {
      category: category
    });
  }

}
