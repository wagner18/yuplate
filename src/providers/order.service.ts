import { Injectable } from '@angular/core';
import * as moment from 'moment';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

// import { OrderModel } from '../models/order-model';
// import { ItemModel } from '../models/item-model';

@Injectable()
export class OrderService {

	private ORDER_REF: string = "orders/";
  private PROFILE_ORDERS_REF: string = "profile_orders/";
  private profile: any;

  public current_time: any = new Date();

  constructor(
  	private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ){

    this.profile = this.profileService.getCurrentProfile();
  }

  /**
  * Create the order using the user key to set the order database reference
  * @param data - Order data
  */
  createOrder(data){
    console.log("Creating order", data);

    if(data.seller_uid && data.buyer_uid){

      // Set the firebase reference
      let order_ref = this.ORDER_REF + data.seller_uid + "/";
      return this._dataService.database.child(order_ref).push(data).then( (result) => {
        console.log(result.key);

        // Set the firebase reference
        // There is many batter ways to code it, I know, but I have not time right now, just make it works!
        // and stop thinking too much! when you can, you will make it better... :(
        let profile_orders_ref = this.PROFILE_ORDERS_REF + data.buyer_uid + "/" + result.key;
        this._dataService.database.child(profile_orders_ref + "/" ).set(data.seller_uid).then( () => {
          console.log("Buyer reference - ",profile_orders_ref);
        });

        return result;
      });
    }else{
      throw "Error creating the order: seller or buyer uid undifined";
    }
  }


  /**
  *	Update a existent order 
  * @param key - the order key reference
  * @param data - order data
  */
  updateOrder(key, data){
    let order_ref = this.ORDER_REF + data.seller_uid + "/";
    return this._dataService.database.child(order_ref + key).set(data);
  }

  /**
  * Return the seller's orders
  */
  getSellerOrders(){
    return new Promise((resolve, reject) => {
      let seller_orders: Array<any> = [];
      let order_ref = this.ORDER_REF + this.profile.uid;
      this._dataService.database.child(order_ref).on('value', (orderSnap) => {

        let orders = orderSnap.val();
        Object.keys(orders).forEach((key) => {
          seller_orders.push(orders[key]);
        });
        resolve(seller_orders);
      },
      (error) =>{
        reject(error);
      });

    });
  }


  /**
  * return the profile's orders
  */
  getProfileOrders(){
    return new Promise((resolve, reject) => {
      let profile_orders: Array<any> = [];
      let profile_orders_ref = this.PROFILE_ORDERS_REF + this.profile.uid;
      this._dataService.database.child(profile_orders_ref).once('value', (refSnap) => {

        let orders = refSnap.val();
        Object.keys(orders).forEach( (order_key) => {

          let seller = orders[order_key];
          let order_ref = this.ORDER_REF + seller + "/" + order_key;
          this._dataService.database.child(order_ref).once('value', (orderSnap) => {
            profile_orders.push(orderSnap.val());
          });

        });
        resolve(profile_orders);
      },
      (error) => {
        reject(error);
      });

    });
  }

  /**
  * Set the available dates and range of time from 
  * the listing schedule with the next 30 days
  * @param schedulesDays = List with the schedule objects
  */
  setItinerary(schedules: Array<any>) {
    // Process the Schedule object to define the business rules
    schedules = schedules.map((day, index) => {
      let time_range = [];
      let from = day.from_time.split(':');
      let to   = day.to_time.split(':');
      return {day: day.day_number, from: from, to: to};
    });

    // User a service method to return the available days within the next 30 days.
    schedules = this.getScheduleObject(schedules);

    console.log("xXXXXXXx",schedules);
    return schedules;
  }

  /**
  * Return a list of dates that machs the giben weekdays within 30 days
  * @param {day, time_range} - availableDays - list of Objects with week days available to the specific listing
  */
  getScheduleObject(availableDays){
    let days = [];
    for(let i = 0; i < 15; i++){

      let day = moment().add(i, 'd'); //new Date(year, month, date + i);
      availableDays.find((weekday) => {
        let isValidDay: boolean = true;
        if(day.day() == weekday.day){

          // check time availability to the current day
          if(this.current_time.getDate() == day.date()){
            let to = parseInt(weekday.to[0]);
            if(this.current_time.getHours() >= to){
               isValidDay = false;
               alert(this.current_time.getHours() + "NOTTTT"+ to);
            }else{
              let from = parseInt(weekday.from[0]);
              if(from < this.current_time.getHours()) {
                weekday.from[0] = this.current_time.getHours() + 1;
              }
            }
          }

          if(isValidDay){
            let time_range = {min: "", max: ""};
            time_range.min = day.format("YYYY-MM-DD") +"T"+ weekday.from.join(":");
            time_range.max = day.format("YYYY-MM-DD") +"T"+ weekday.to.join(":");

            days.push({moment: day, time_range: time_range});
          }
          
        }
      });
    }
    return days;
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
