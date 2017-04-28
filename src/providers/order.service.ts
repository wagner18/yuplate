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
