import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
// import { FullDateFormat } from '../../app/pipes/full-date-format';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { OrderService } from '../../providers/order.service';

// import { ProfilePaymentMethodPage } from '../profile-payment-method/profile-payment-method';

import { OrderPaymentPage } from '../order-payment/order-payment';

@Component({
  selector: 'page-order-checkout',
  templateUrl: 'order-checkout.html',
  // pipes: [FullDateFormat],
  providers: [OrderService]
})
export class OrderCheckoutPage {

	public order: any;
	public order_key: string;
  public show_delivery_fee: boolean = false;
	public shipping_address: boolean = false;
	public carryout_address: boolean = false;
  public schedule: any;

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

  	console.log(this.order);

  	//Set a data object to the schedule's timestamp
  	this.schedule = moment(this.order.delivery_schedule).format("LLLL");
    // this.schedule = this.schedule.toString().slice(0,21);// + " " + this.delivery_schedule.getHours() +":"+ this.delivery_schedule.getMinutes();

  	// Set the shipping address - if for delivery
  	if(this.order.delivery_option == "Delivery") {
  		this.shipping_address = true;
      this.show_delivery_fee = true;
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
  *
  */
  proceedPayment() {
    this.nav.setRoot(OrderPaymentPage, { order: this.order, order_key: this.order_key });
  }
  

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setPaymentMethod() {
    
  }

}
