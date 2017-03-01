import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { OrderService } from '../../providers/order.service';


@Component({
  selector: 'page-profile-orders',
  templateUrl: 'profile-orders.html',
  providers: [OrderService]
})
export class ProfileOrdersPage {

	public orders: Array<any> = [];

  constructor(
  	public nav: NavController, 
  	public params: NavParams,
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
  	this.orderService.getProfileOrders().once('value', (orderSnap) => {

  		let orders = orderSnap.val();
  		this.orders = Object.keys(orderSnap.val()).map((key) => {

  			let schedule = new Date(orders[key].delivery_schedule);
  			orders[key].schedule = schedule.toString().slice(0,21);
  			return orders[key];
  		});

  		// let orders = orderSnap.val();
  		// this.orders = orders.map((order) => {
  		// 	return order;
  		// });

  		console.log(this.orders);
  	});
  }


  /**
  *
  */
  showOrderDetails(key){
  	console.log("order - ", key);
  }

}
