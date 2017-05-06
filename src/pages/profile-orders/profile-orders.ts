import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { OrderService } from '../../providers/order.service';


@Component({
  selector: 'page-profile-orders',
  templateUrl: 'profile-orders.html',
  providers: [OrderService]
})
export class ProfileOrdersPage {

	public orders: any;

  constructor(
  	public nav: NavController, 
  	public params: NavParams,
    public loadingCtrl: LoadingController,
  	private _authService: AuthService,
  	public profileService: ProfileService,
    public orderService: OrderService,
  ){
  }

  ionViewDidLoad() {
	 	this.loadOrders();
  }

  /**
  *
  */
  loadOrders(){
    let loading = this.loadingCtrl.create();
    loading.present();
  	this.orderService.getProfileOrders().then( (profile_orders) => {
      console.log(profile_orders);
      this.orders = profile_orders;
      loading.dismiss();
    });
  }


  /**
  *
  */
  showOrderDetails(key){
  	console.log("order - ", key);
  }

}
