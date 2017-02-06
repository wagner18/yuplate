import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { OrderService } from '../../providers/order.service';

import { ListingDetailsPage } from '../listing-details/listing-details';
import { ListingOrderPage } from '../listing-order/listing-order';
import { ProfilePaymentMethodPage } from '../profile-payment-method/profile-payment-method';


@Component({
  selector: 'page-order-checkout',
  templateUrl: 'order-checkout.html'
})
export class OrderCheckoutPage {

	public order: any;
	public order_key: string;
	public schedule: Date;
	public shipping_address: boolean = false;
	public carryout_address: boolean = false;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
  	public params: NavParams,
    private _authService: AuthService,
    public orderService: OrderService,
    public listingService: ListingService,
    public profileService: ProfileService
  ){

  }

  ionViewWillLoad(){
  	this.order = this.params.get('order');
  	this.order_key = this.params.get('order_key');

  	console.log(this.order_key);

  	//Set a data object to the schedule's timestamp
  	this.schedule = new Date(this.order.schedule);

  	// Set the shipping address - if for delivery
  	if(this.order.delivery_option == "Delivery") {
  		this.shipping_address = true;
  	}else{
  		this.carryout_address = true;
  	}


    console.log(this.order);
  }

  ionViewDidLoad() {

  }

  /**
  * Set the order as canceled
  */
  cancelOrder(){
    if( this.order !== undefined ){
      // Set the order status history
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.canceled;
      this.order.status_history.push(order_labels.canceled);
      this.orderService.updateOrder(this.order_key, this.order).then(()=>{
      	this.nav.removeView(this.nav.getPrevious());
      	this.viewCtrl.dismiss();
      })
      .catch((error)=>{
        console.log(error.message);
      });
    }
  }
  /**
  * Show a alert confirm before cancel the order
  */ 
  cancelOrderConfirmation() {
    let confirm = this.alertCtrl.create({
      title: 'Cancel My Order',
      message: 'Are you sure you want to cancel your order?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cancelOrder();
          }
        },{
          text: 'No',
          handler: () => {
            console.log('Cancel the action');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
  *
  */
  editOrder() {

  }

  /**
  *
  */
  holdOrder(){

  }

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setPaymentMethod() {
    this.nav.push(ProfilePaymentMethodPage, { profile: "" });
  }

}
