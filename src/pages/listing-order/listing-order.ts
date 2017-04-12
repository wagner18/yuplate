import { Component } from '@angular/core';
import { App, NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
// import { counterRangeValidator } from '../../components/counter-input/counter-input';
// import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { OrderService } from '../../providers/order.service';

import { OrderCheckoutPage } from '../order-checkout/order-checkout';
import { ProfileFormAddressPage } from '../profile-form-address/profile-form-address';
import { ProfilePaymentMethodPage } from '../profile-payment-method/profile-payment-method';

import { OrderModel } from '../../models/order-model';

@Component({
  selector: 'page-listing-order',
  templateUrl: 'listing-order.html',
  providers: [OrderService]
})
export class ListingOrderPage {

	public formOrder: FormGroup;
	public listing: any;
	public quantity: number = 1;
  public subtotal: number = 0;

  public profile: any;
  public primaryAddress: any;
  public shipping_address: boolean = true;
  public pickup_address: boolean = false;
  public order: OrderModel;
  public order_key: string;

  // Schedule properties
  public formSchedule: FormGroup;
  public current_time: any = new Date();
  public availableDays: Array<any> = [];
  public scheduleDays: Array<any> = [];

  public delivery_time_range: Array<any> = [];
  public schedule_time_range: any;
  public order_schedule: any;
  

  public take_today: boolean = false;
  public schedule_delivery: boolean = false;
  public intime_schedule: boolean = false;
  

  constructor(
    public appCtrl: App,
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
    private _authService: AuthService,
    public orderService: OrderService,
    public listingService: ListingService,
    public profileService: ProfileService
  ){

  	this.formOrder = new FormGroup({
      quantity: new FormControl(1, Validators.required),
      total_price: new FormControl(0.00, Validators.required),
      delivery_option: new FormControl("Delivery", Validators.required),
      delivery_schedule: new FormControl(''),
      confirmation: new FormControl(false)
    });

    this.formSchedule = new FormGroup({
      delivery_time: new FormControl(''),
      schedule_day: new FormControl(''),
      schedule_time: new FormControl('')
    });

  }

  ionViewWillLoad() {
    this.listing = this.params.get('listing');
    this.order_key = this.params.get('order');

    if(this.listing.delivery){

      this.profile = this.profileService.getCurrentProfile();

      if(this.profile.addresses !== undefined ){
        this.primaryAddress = this.profile.addresses.find(function(address){
          return address.primary == true;
        });
      }

      // Set the primary user address
      // this.profileService.getProfile().then((fatchProfile) => {
      //   fatchProfile.on("value", (profileSnap) =>{
      //     if(profileSnap.val()){
      //       this.userProfile = profileSnap.val();
      //       if(this.userProfile.addresses !== undefined ){
      //         this.primaryAddress = this.userProfile.addresses.find(function(address){
      //           return address.primary == true;
      //         });
      //       }
      //     }
      //   });
      // },(error) => {
      //   console.log(error.message);
      // });

    }else{

      this.formOrder.patchValue({delivery_option: "Carryout"});
      this.shipping_address = false;
      this.pickup_address = true;

      console.log("JUST Carryout",this.listing);
    }

  }

  /**
  *
  */
  ionViewDidLoad() {
    this.subtotal = this.listing.main_price;
    this.formOrder.patchValue({total_price: this.setDeliveryFee(this.subtotal)});
  }

  /**
  * Dismiss the Location Modal and retrive the data to the caller
  */
  dismiss() {
    // If order has been created, in case of cancel, set the order as canceled
    if(this.order_key){
      // Set the order status history
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.canceled;
      this.order.status_history.push(order_labels.canceled);
      this.orderService.updateOrder(this.order_key, this.order)
      .catch((error)=>{
        console.log(error.message);
      });
    }

    this.viewCtrl.dismiss();
	}

  /**
  * Set the price on change of quantity property
  * @param event - the value form the event emiter
  */
  setTotalPrice(quantity){
    this.subtotal = (this.listing.main_price * quantity);
    // Add delivery fee if there is a delivery fee
    let total_price = this.setDeliveryFee(this.subtotal);
    this.formOrder.patchValue({total_price: total_price});
  }

  /**
  * Verify is there is a delivery fee and aplay the fee to the total price is true
  * @param subtotal - the quantite multiplied by the main listing price
  */
  setDeliveryFee(subtotal){
    let total_price = subtotal;
    if(this.formOrder.value.delivery_option == "Delivery" && this.listing.delivery_fee){
       total_price = parseFloat(subtotal) + parseFloat(this.listing.delivery_fee);
    }
    return total_price;//.toFixed(2);
  }

  /**
  *
  */
  setDeliveryAddress(){
    this.shipping_address = true;
    this.pickup_address = false;
  }
  setCarryoutAddress(){
    this.shipping_address = false;
    this.pickup_address = true;
  }

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setAddress() {
    this.nav.push(ProfileFormAddressPage, { profile: this.profile });
  }

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setPaymentMethod() {
    this.nav.push(ProfilePaymentMethodPage, { profile: this.profile });
  }

  /**
  *
  */
  setScheduleIntime() {
    this.take_today = true;
    this.schedule_delivery = false;
    // Set the date availability to schedule
    this.setSchedule();
  }

  /**
  *
  */
  setScheduleDelivery() {
    this.schedule_delivery = true;
    this.take_today = false;
    // Set the date availability to schedule
    this.setSchedule();
  }


  /** SEND TO THE LISTING SERVICE PROVIDER!!!
  * Set the available dates and range of time from 
  * the listing schedule with the next 30 days
  */
  setSchedule() {
    // Process the Schedule object to define the business rules
    this.scheduleDays = this.listing.schedule.map((day, index) => {
      let time_range = [];
      let from = parseInt(day.from_time.split(':')[0]);
      let to   = parseInt(day.to_time.split(':')[0]);
      let time = from;

      // Set the time range availability
      while(time <= to){
        time_range.push(time);

        // Define if the intime schedule are available and
        // check if the start time is greater than current time
        if(this.current_time.getDay() == day.day_number){
          console.log(time,this.current_time.getHours());
          if(time > this.current_time.getHours()) {
            this.intime_schedule = true;
            this.delivery_time_range.push(time);
            // check if the current time is greater than the start time
            // if() {}
          }
        }
        time += 1;
      }

      return {day: day.day_number, time_range: time_range.toString()};
    });

    // User a service method to return the available days within the next 30 days.
    this.listingService.getAvailableDays(this.scheduleDays).map((day) => {
      if(day.getDay() != this.current_time.getDay()){
        this.availableDays.push(day);
      }
      //return weekdays[day.getDay()].label +" "+ (day.getMonth()+1) +"/"+ day.getDate();// +"/"+ day.getFullYear();
    });
  }

  /**
  * Set the time range based on the range for each weekday from the listing
  * @param selectDate - the date from the onChange event of the date select field
  */
  setTimeRange(selectDate) {
    let date = new Date(selectDate);
    this.schedule_time_range = this.scheduleDays.find((obj) => {
      return obj.day == date.getDay();
    });
  }

  /**
  *
  */
  validOrder(){
    return (this.formOrder.valid) &&  (this.formSchedule.value.delivery_time != '' ||   this.formSchedule.value.schedule_day != '');
  }

  /** - MOVE THE ORDER OBJECT THE THE ORDER SERVICE PROVIDER!!!!!
  * Set the Order Checkout object
  */
  checkoutOrder() {
    console.log(this.validOrder());
    if(this.validOrder()){

      this.order = new OrderModel();

      //Process the order scheduleDay
      if(this.take_today){
        this.order_schedule = new Date();
        let delivery_time = this.formSchedule.value.delivery_time.split(":");
        this.order_schedule.setHours(delivery_time[0]);
        this.order_schedule.setMinutes(delivery_time[1]);

      }else if(this.schedule_delivery){
        this.order_schedule = new Date(this.formSchedule.value.schedule_day);
        let schedule_time = this.formSchedule.value.schedule_time.split(":");
        this.order_schedule.setHours(schedule_time[0]);
        this.order_schedule.setMinutes(schedule_time[1]);
        this.order_schedule.setSeconds(0);;
      }


      console.log(this.order_schedule);
      // Base listing data
      let summarized_listing = this.listingService.summarizeListing(this.listing);
      this.order.listing = summarized_listing;

      // Form data
      this.order.quantity = this.formOrder.value.quantity;
      this.order.delivery_option = this.formOrder.value.delivery_option;
      this.order.total_price = this.formOrder.value.total_price;
      this.order.subtotal = this.subtotal;
      this.order.delivery_schedule = this.order_schedule.getTime();

      if(this.order.delivery_option == "Delivery"){
        this.order.delivery_address = this.primaryAddress;
      }
      this.order.buyer_uid = this.profile.uid;
      this.order.seller_uid = this.listing.uid;

      // Set the order status
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.open;
      // Set the order status history
      this.order.status_history.push(order_labels.open);

      if(this.order_key){
        this.orderService.updateOrder(this.order_key, this.order).then(()=>{
          console.log(this.order);
          // this.nav.push(OrderCheckoutPage, { order: this.order });

          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().push(OrderCheckoutPage, { order: this.order });
        })
        .catch((error)=>{
          console.log(error.message);
        });
      }else{
        // Save the data to the database
        this.orderService.createOrder(this.order).then((result)=>{
          this.order_key = result.key;
          // this.nav.push(OrderCheckoutPage, { order_key: this.order_key, order: this.order});

          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().push(OrderCheckoutPage, { order_key: this.order_key, order: this.order});

        }).catch((error)=>{
          console.log(error.message);
        });
      }

    }

  }

}
