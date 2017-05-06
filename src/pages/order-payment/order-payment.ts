import { Component } from '@angular/core';
import { App, NavController, ViewController, NavParams } from 'ionic-angular';

import { ListingPage } from '../listing/listing';
import { ProfileOrdersPage } from '../profile-orders/profile-orders';

@Component({
  selector: 'page-order-payment',
  templateUrl: 'order-payment.html'
})
export class OrderPaymentPage {

	public order: any;
	public order_key: string;
  public show_delivery_fee: boolean = false;

  constructor(
    public appCtrl: App,
  	public nav: NavController,
    public viewCtrl: ViewController,
  	public params: NavParams
  ) {}

  ionViewWillLoad() {
  	this.order = this.params.get('order');
  	this.order_key = this.params.get('order_key');

    if(this.order.delivery_option == "Delivery") {
      // this.shipping_address = true;
      this.show_delivery_fee = true;
    }else{
      this.show_delivery_fee = false;
      // this.carryout_address = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPaymentPage');
  }

  /**
  *
  */
  goToMyOrders(){
    this.nav.setRoot(ProfileOrdersPage);
  }

  /**
  *
  */
  goToHome() {
    // this.viewCtrl.dismiss();
    this.nav.setRoot(ListingPage);
  	//this.appCtrl.getRootNav().push(ListingPage);
  }

}
