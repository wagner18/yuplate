import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ListingService } from '../../providers/listing.service';

@Component({
  selector: 'page-listing-form-details',
  templateUrl: 'listing-form-details.html'
})
export class ListingFormDetailsPage {

	public formDetails: FormGroup;
	public data: any;
  public measure_units: any;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
    public listingService: ListingService,
  	public params: NavParams
  ){

  	this.formDetails = new FormGroup({
      carryout: new FormControl(false),
  		delivery: new FormControl(false),
      delivery_fee: new FormControl(0.00),
      measure_unit: new FormControl('', Validators.required),
      unit_value: new FormControl(1, Validators.required),
      confirmation: new FormControl(false)
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    console.log(this.data);
    this.measure_units = this.listingService.getMeasureUnits();

    this.formDetails.setValue({
      carryout: this.data.carryout,
    	delivery: this.data.delivery,
      delivery_fee: this.data.delivery_fee,
      measure_unit: this.data.measure_unit,
    	unit_value: this.data.unit_value,
      confirmation: this.data.confirmation
    });
  }

  dismiss() {
    this.data.carryout = this.formDetails.value.carryout;
		this.data.delivery = this.formDetails.value.delivery;
    this.data.delivery_fee = this.formDetails.value.delivery_fee;
    this.data.measure_unit = this.formDetails.value.measure_unit;
    this.data.unit_value = this.formDetails.value.unit_value;
    this.data.confirmation = this.formDetails.value.confirmation;

		if(this.formDetails.valid){
			this.data.form_control[4] = true;
		}else{
			this.data.form_control[4] = false;
		}
		this.viewCtrl.dismiss(this.data);
	}

}
