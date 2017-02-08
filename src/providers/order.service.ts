import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

import { OrderModel } from '../models/order-model';
import { ItemModel } from '../models/listing-model';

import { ScheduleModel } from '../models/listing-model';
import { LocationModel } from '../models/listing-model';

@Injectable()
export class OrderService {

	private ORDER_REF: string = "orders/";

  constructor(
  	private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ){
  }

  /**
  * Create the order using the user key to set the order database reference
  * @param data - Order data
  */
  createOrder(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.buyer_uid = currentUser.uid;
      let order_ref = this.ORDER_REF + currentUser.uid + "/";
      return this._dataService.database.child(order_ref).push(data);
    });
  }


  /**
  *	Update a existent order 
  * @param key - the order key reference
  * @param data - order data
  */
  updateOrder(key, data){
    return this._auth.getCurrentUser().then((currentUser) => {
      let order_ref = this.ORDER_REF + currentUser.uid + "/";
      return this._dataService.database.child(order_ref + key).set(data);
    });
  }


  /**
  *
  */
  getStatusLabel() {
  	let status_label = {
  		open: "Open",
  		onfirmed: "Confirmed", 
  		payed: "Payed", 
  		shipped: "Shipped", 
  		delivered: "Delivered", 
  		finished: "Finished", 
  		canceled: "Canceled"
  	};

  	return status_label;
  }

}