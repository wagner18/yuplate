import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Slides} from 'ionic-angular';

import { FeedPage } from '../feed/feed';
//import 'rxjs/Rx';
import { DishItemModel } from '../../models/dish.model';
import { DishService } from '../../providers/dish.service';

import { ListingService } from '../../providers/listing.service';
import { ItemModel } from '../../models/listing-model';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
  providers: [ DishService ]
})
export class ListingPage {

  
  public slideOptions = {pager: true};
  public loading: any;

  public list_limit: number = 10;
  public listings: ItemModel[];

  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController
  ){

    console.log("View Controller in Stake >>> ", this.nav.length());
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    this.loading.present();
    this.getItems();
  }

  private getItems(){

    let query = {
        limitToFirst:5,
        orderByKey: true
    };

    this.listingService.listListing(query).limitToLast(this.list_limit).on('value', (listingSnap) => {
      let objects = listingSnap.val();
      this.listings = Object.keys(objects).map(function (key) {
        objects[key].listing_key = key;
        return objects[key]; 
      });

      this.loading.dismiss();
    });

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
