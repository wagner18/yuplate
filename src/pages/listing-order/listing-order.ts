import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ListingOrderModel } from '../../models/listing-model';

@Component({
  selector: 'page-listing-order',
  templateUrl: 'listing-order.html'
})
export class ListingOrderPage {

	public formOrder: FormGroup;
	public listing: any;
	public quantity: number = 1;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams
  ){

  	this.formOrder = new FormGroup({
      carryout: new FormControl(false),
  		delivery: new FormControl(false),
  		quantity: new FormControl(1),
      total_price: new FormControl(0.00),
      confirmation: new FormControl(false)
    });
  }

  ionViewWillLoad() {
    this.listing = this.params.get('listing');
    console.log(this.listing);
  }


  /**
  * Dismiss the Location Modal and retrive the data to the caller
  */
  dismiss() {
    this.viewCtrl.dismiss();
	}

}
