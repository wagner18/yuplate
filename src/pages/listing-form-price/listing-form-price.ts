import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { PriceModel } from '../../models/listing-model';

@Component({
  selector: 'page-listing-form-price',
  templateUrl: 'listing-form-price.html'
})
export class ListingFormPricePage {

 public formPrice: FormGroup;
	public data: any;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	private alertCtrl: AlertController,
  	public params: NavParams
  ){

  	this.formPrice = new FormGroup({
      main_price: new FormControl('', Validators.required),
      long_term_price: new FormControl('', Validators.required),
      currency: new FormControl('')
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    if(this.data.price !== undefined ){
    	this.formPrice.setValue({
	    	main_price: this.data.price.main_price,
	    	long_term_price: this.data.price.long_term_price,
	    	currency: this.data.price.currency
	    });
    }else{
    	this.data.price = new PriceModel();
    }
  }

  /*
  *
  */
  save() {

  	if(this.formPrice.valid){
			this.data.price.main_price = this.formPrice.value.main_price;
	    this.data.price.long_term_price = this.formPrice.value.long_term_price;
	    this.data.price.currency = this.formPrice.value.currency;

			this.data.form_control.price = true;
		}else{
			this.data.form_control.price = false;
		}

		this.viewCtrl.dismiss(this.data);
	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}


	setPrice(){
		console.log("set the price");
	}


	pricePrompt() {
	  let alert = this.alertCtrl.create({
	    title: 'Set your price',
	    inputs: [
	      {
	        name: 'price',
	        placeholder: 'Price'
	      },
	      {
	        name: 'date',
	        placeholder: 'Date',
	        type: 'date'
	      }
	    ],
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: data => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'save',
	        handler: data => {
						this.setPrice();
	        }
	      }
	    ]
	  });
	  alert.present();
	}

}