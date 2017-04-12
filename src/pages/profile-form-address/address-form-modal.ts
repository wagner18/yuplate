import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';


/**
* Define an inter modal to the address address
*/
@Component({
  selector: 'address-form-modal',
  templateUrl: 'address-form-modal.html'
})
export class AddressFormModal {

  public addressForm: FormGroup;
	public data: any;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams
  ){

    this.addressForm = new FormGroup({
      full_name: new FormControl('',Validators.required),
      street_1: new FormControl('', Validators.required),
      street_2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip_code: new FormControl('', Validators.required),
      phone: new FormControl(''),
      country: new FormControl('United States', Validators.required),
      primary: new FormControl(false)
    });

  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    console.log(this.data);

    if(this.data !== undefined){
      this.setAddress(this.data);
    }
  }

  /**
  * Set the data to the form control in of editting
  */
  setAddress(data){
    this.addressForm.setValue({
      full_name: data.full_name,
      street_1: data.street_1,
      street_2: data.street_2,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      phone: data.phone,
      country: data.country,
      primary: data.primary
    });
  }

  /**
  * Dismiss the address form modal
  */
  saveAddress() {
    if(this.addressForm.valid){
      this.viewCtrl.dismiss(this.addressForm.value);
    }
  }

  /**
  * Dismiss the address form modal
  */
  dismiss() {
		this.viewCtrl.dismiss();
	}

}