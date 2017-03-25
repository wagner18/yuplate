import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ProfileService } from './profile.service';
import { DataService } from './data.service';

import { ItemModel } from '../models/item-model';

import { MediaModel } from '../models/listing-model';
import { PriceModel } from '../models/listing-model';
import { ScheduleModel } from '../models/listing-model';
import { LocationModel } from '../models/listing-model';


@Injectable()
export class ListItemService {

	private LISTING_REF: string = "listings/";
	public item: ItemModel;
	public profile: any;

  constructor(
    private _dataService: DataService,
    public profileService: ProfileService
  ){

  	// set the current logged profile
    this.profile = this.profileService.getCurrentProfile();
  }

  /**
  * Generate a flat item based on the listing draft to be published
  * @param draft = item object
  */
  publishItem(draft){

  	if(this.profile !== undefined ){
  		 //Set the item to be published
  		this.setItem(draft);
  		console.log(draft);
      return this._dataService.database.child(this.LISTING_REF + draft.key).set(this.item);
    }

  }

  /**
  * Set t
  */
  setItem(draft){
  	if(draft !== undefined && draft !== null ){

  		this.item = new ItemModel();

  		this.item.title = draft.title;
	    this.item.summary = draft.summary;
	    this.item.description = draft.description;
	    this.item.privacity = draft.privacity;
	    this.item.carryout = draft.carryout;
	    this.item.delivery  = draft.delivery;
	    this.item.delivery_fee = draft.delivery_fee;
	    this.item.shipping = draft.shipping;
	    this.item.shipping_fee = draft.shipping_fee;
	    this.item.processing_time = draft.processing_time;
	    this.item.measure_unit = draft.measure_unit;
	    this.item.unit_value = draft.unit_value;
	    this.item.confirmation = draft.confirmation;
	    this.item.listing_type = draft.listing_type;

	    this.item.main_price = draft.price.main_price;
	    this.item.promotion_price = draft.price.long_term_price;
	    this.item.currency = draft.price.currency;

	    this.item.total_favorites = 0;
	    this.item.total_reviews =  0;
	    this.item.total_rate = 1;

	    this.item.medias = draft.medias;
	    this.item.reviews = [];

	    this.item[draft.key] = true;
	    this.item.seller_uid = this.profile.uid;

	    return this.item;
  	}
  }


  /**
  * List the item to the current user profile based on his database UID
  */
  listItems(){
    return this._dataService.database.child(this.LISTING_REF);
  }


  /**
  *
  */
  saveListing(data){
    if(this.profile !== undefined ){
      return this._dataService.database.child(this.LISTING_REF).push(data);
    }
  }

}
