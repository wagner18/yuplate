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

	categories_checkbox_open: boolean;
  categories_checkbox_result;
  categories: Array<any> = [];

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
      measure_unit: new FormControl(''),
      unit_value: new FormControl(1),
      confirmation: new FormControl(false)
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

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

	chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Categories');

    alert.addInput({
      type: 'checkbox',
      label: 'Steak',
      value: 'Steak'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Chicken',
      value: 'Chicken'
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

}
