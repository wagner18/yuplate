import { Component} from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

import { ListingService } from '../../providers/listing.service';

@Component({
  selector: 'page-listing-filter',
  templateUrl: 'listing-filter.html'
})
export class ListingFilterPage {

	public formFilter: FormGroup;
	public filter: any;

	//Filters options
	public categories: Array<any> = [];

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
  	public listingService: ListingService
  ){

  	this.formFilter = new FormGroup({
  		available_today: new FormControl(false),
  		distance: new FormControl(5),
  		price_range_from: new FormControl(),
  		price_range_to: new FormControl,
      categories_filter: new FormControl(false)
    });

  }

  ionViewDidLoad() {
  	this.categories = this.listingService.getListingCategories();
  }

  /**
  * Dismiss the filter modal
  */
  dismiss() {
    this.viewCtrl.dismiss();
	}


  /**
  * Apply the filter to the list
  */
  applyFilter() {
  	console.log(this.formFilter.value);

    this.viewCtrl.dismiss(this.formFilter.value);
	}


  /**
  *
  */
  setCetetories(value){
    if(value === "All"){
      console.log(value);
    }else{
      console.log(this.formFilter.value.categories_filter);
    }
  }

}
