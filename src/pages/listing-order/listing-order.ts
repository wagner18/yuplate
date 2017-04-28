import { Component } from '@angular/core';
import { App, NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
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
  public order: OrderModel;
  public order_key: string;

  // Schedule properties
  public formSchedule: FormGroup;
  public availableDays: Array<any> = [];

  public take_today: any;
  public schedule_delivery: string;

  public isAvailableToday: boolean = false;

  public dateMin: string = "2017-04-18";
  public dateMax: string = "2017-05-02";
  public monthValues: Array<string> = [];
  public dayValues: Array<string> = [];
  public time_range: any = {};


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
      schedule_time: new FormControl({value: '', disabled: true})
    });

  }

  ionViewWillLoad() {
    this.listing = this.params.get('listing');
    this.order_key = this.params.get('order');

    if(this.listing.delivery || this.listing.shipping){

      this.profile = this.profileService.getCurrentProfile();

      if(this.profile.addresses !== undefined ){
        this.primaryAddress = this.profile.addresses.find(function(address){
          return address.primary == true;
        });
      }

    }else{
      this.formOrder.patchValue({delivery_option: "Carryout"});
    }

  }

  /**
  *
  */
  ionViewDidLoad() {
    this.subtotal = this.listing.main_price;
    this.formOrder.patchValue({total_price: this.setDeliveryFee(this.subtotal)});
    // Set the date availability to schedule
    this.setItinerary();
  }

  /**
  *
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
  * Verify if there is a delivery fee and apply the fee to the total price
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
  * Show the profile shipping address screen
  * Send the user profile object as a parammeter to the target page
  */
  setAddress() {
    this.nav.push(ProfileFormAddressPage, { profile: this.profile });
  }

  /**
  * Show the payment method screen
  * Send the user profile object as a parammeter to the target page
  */
  setPaymentMethod() {
    this.nav.push(ProfilePaymentMethodPage, { profile: this.profile });
  }

  /**
  * @param option
  */
  setScheduleDelivery(option) {
    if(option == 'schedule'){
      this.schedule_delivery = "schedule";
    }else{
      this.schedule_delivery = "intime";
    }
  }


  /** 
  * Set the available dates and range of time from 
  * the listing schedule with the next 30 days
  */
  setItinerary() {
    // User a service method to return the available days within the next 30 days.
    this.availableDays = this.orderService.setItinerary(this.listing.schedule);

    console.log(this.availableDays);

    //set the minimum date parammeter
    let firstDay = this.availableDays[0].moment;
    this.dateMin = firstDay.format("YYYY-MM-DD");
    //set the maximum date parammeter
    let lastDay = this.availableDays[this.availableDays.length - 1].moment;
    this.dateMax = lastDay.format("YYYY-MM-DD");


    this.availableDays.forEach((day) => {

      console.log(moment().format("YYYY-MM-DD"), day.moment.format("YYYY-MM-DD"));

      // Check if is available take_today
      if(moment().format("YYYY-MM-DD") == day.moment.format("YYYY-MM-DD")){
        this.isAvailableToday = true;
        this.take_today = moment().add(1, 'h');
      }

      // set the month range
      let month = day.moment.format("MM");
      if(this.monthValues.indexOf(month) == -1){
        this.monthValues.push(month);
      }
      this.dayValues.push(day.moment.format("DD"));
    });
  }

  /**
  * Set the time range based on the range for each weekday from the listing
  */
  setTimeRange() {
    this.formSchedule.get('schedule_time').enable();
    let selectedDate = moment(this.formSchedule.value.schedule_day);
    let date = this.availableDays.find((day) => {
       if(day.moment.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")){
         return day;
       }
    });
    this.time_range = date.time_range;
    console.log("TIME RANGE - ",this.time_range);
    this.formSchedule.get('schedule_time').reset();
  }

  /**
  *
  */
  validOrder(){
    return (this.formOrder.valid);
     // &&  (this.formSchedule.value.delivery_time != '' ||   this.formSchedule.value.schedule_day != '');
  }

  /** - MOVE THE ORDER OBJECT THE THE ORDER SERVICE PROVIDER!!!!!
  * Set the Order Checkout object
  */
  checkoutOrder(): void {
    if(this.validOrder()){
      this.order = new OrderModel();

      if(this.schedule_delivery == "intime") {
        this.order.delivery_schedule = this.take_today.valueOf();
      }else {
        let schedule_date = this.formSchedule.value.schedule_day+"T"+this.formSchedule.value.schedule_time;
        this.order.delivery_schedule = moment(schedule_date, "YYYY-MM-DDTHH:mm").valueOf();
      }

      // Set a Listing snapshot to the order object
      this.order.listing_snapshot = this.listing;
      this.order.buyer_uid = this.profile.uid;
      this.order.seller_uid = this.listing.seller_uid;

      // Form data
      this.order.quantity = this.formOrder.value.quantity;
      this.order.delivery_option = this.formOrder.value.delivery_option;
      this.order.total_price = this.formOrder.value.total_price;
      this.order.subtotal = this.subtotal;

      if(this.order.delivery_option == "Delivery"){
        this.order.delivery_address = this.primaryAddress;
      }

      // Set the order status
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.open;
      // Set the order status history
      this.order.status_history.push(order_labels.open);

      // Update the order with the given key
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

      }else { // Create a new order
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
