import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { AuthService } from '../../providers/auth.service';
import { BaseProvider } from '../../app/base.provider';
import { ListingService } from '../../providers/listing.service';

import { ItemModel } from '../../models/listing-model';
import { MediaModel } from '../../models/listing-model';

import { ListingPage } from '../listing/listing';
import { ListingFormPage } from '../listing-form/listing-form';

@Component({
  selector: 'page-listing-user',
  templateUrl: 'listing-user.html'
})
export class ListingUserPage {

	public listings: Array<ItemModel> = [];
	public list_limit: number = 20;
	public listing_key: string;
	public loading: any;

  constructor(
  	public nav: NavController,
    public BaseApp: BaseProvider,
    public listingService: ListingService,
  	public params: NavParams,
  	public loadingCtrl: LoadingController
  ) {
  	this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.getItems();
  }

  private getItems(){

    let query = {
        orderByKey: true
    };

    this.loading.present();
    this.listingService.listListing(query).limitToLast(this.list_limit).on('value', (listingSnap) => {

      let objects = listingSnap.val();
      if(objects !== undefined){
	      this.listings = Object.keys(objects).map(function (key) {
	      	objects[key].listing_key = key;
	      	return objects[key]; 
	      });
	    }else{
	    	this.listings = [];
	    }
      this.loading.dismiss();
    });

  }

  addListing(){
  	this.nav.push(ListingFormPage);
  }

  editListing(key){
  	this.nav.push(ListingFormPage, {key: key});
  }

}
