import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProfileService } from '../../providers/profile.service';
import { AddressFormModal } from './address-form-modal';


@Component({
  selector: 'page-profile-form-address',
  templateUrl: 'profile-form-address.html'
})
export class ProfileFormAddressPage {

	public ADDRESS_REF: string = "/addresses/";
	public showForm: boolean = false;
	public addresses: Array<any> = [];
	public noAddress: boolean = true;
	public profile: any;

  constructor(
  	public nav: NavController,
  	public modalCtrl: ModalController,
  	public alertCtrl: AlertController,
  	public params: NavParams,
  	private _profileService: ProfileService
  ) {

  }

  ionViewDidLoad() {
    this.profile = this.params.get('profile');

    if(this.profile.addresses !== undefined ){
    	this.addresses = this.profile.addresses;
    }

    if(this.addresses.length > 0) {
    	this.noAddress = false;
    }
  }

	/**
  * show and handle the address Modal return
  */
  presentAddressModal() {
    let addressModal = this.modalCtrl.create(AddressFormModal);
    addressModal.onDidDismiss(data => {
      if(data){
        this.noAddress = false;
        this.saveAddress(data);  
      }
    });
    addressModal.present();
  }

  /**
  * Edit address
  * @param index - the address index
  */
  editAddress(index){
  	let addressModal = this.modalCtrl.create(AddressFormModal, { data: this.addresses[index] });
    addressModal.onDidDismiss(data => {
      if(data){
     		this.saveAddress(data, index);
      }
    });
    addressModal.present();
  }

  /**
  * Save or update the address list to the database
  * @param data - the new address to be added to the address list
  * @param index - the address index
  */
  saveAddress(data, index?) {

	 	if(data.primary === true){
  		this.addresses = this.addresses.map(function(address){
	  		address.primary = false;
	  		return address;
	  	});
  	}

  	if(index !== undefined){
	  	this.addresses[index] = data;
  	}else{
  		this.addresses.push(data);
  	}

    let profile_ref = this.profile.uid + this.ADDRESS_REF;
    return this._profileService.updateProfile(profile_ref, this.addresses); 
  }

  /**
  * Delete address
  * @param index - the address index
  */
  deleteAddressItem(index){
    this.addresses.splice(index, 1);
    let address_ref = this.profile.uid + this.ADDRESS_REF;
    return this._profileService.updateProfile(address_ref, this.addresses);  
  }

  /**
  * Show a alert confirm before delete the address
  * @param index - the address index
  */ 
  deleteAddressConfirmation(index) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteAddressItem(index);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel the action');
          }
        }
      ]
    });
    confirm.present();
  }


}
