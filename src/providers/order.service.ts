import { Injectable } from '@angular/core';
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
  getProfileOrders(){
    let order_ref = this.ORDER_REF + this.profile.uid;
    return this._dataService.database.child(order_ref);
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
      let from = parseInt(day.from_time.split(':')[0]);
      let to   = parseInt(day.to_time.split(':')[0]);
      return {day: day.day_number, from: from, to: to};
    });

    let availableDays: Array<any> = [];
    // User a service method to return the available days within the next 30 days.
    this.getAvailableDays(schedules).map((day) => {
        availableDays.push(day);
    });
    return availableDays;
  }

  /**
  * Return a list of dates that machs the giben weekdays within 30 days
  * @param {day, time_range} - availableDays - list of Objects with week days available to the specific listing
  */
  getAvailableDays(availableDays){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    let days = [];

    for(let i = 0; i < 15; i++){
      let day = new Date(year, month, date + i);
      availableDays.find((weekday) => {
        if(day.getDay() == weekday.day){

          let time_range = [];
          let time = weekday.from;
          // Set the time range availability
          while(time <= weekday.to){
            // check time availability to the current day
            if(this.current_time.getDate() == day.getDate()){
              if(time > this.current_time.getHours()) {
                time_range.push(time);
              }
            }else{
              time_range.push(time);
            }
            time += 1;
          }
          days.push({day:day, time_range: time_range.toString()});
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
