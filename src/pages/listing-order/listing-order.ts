import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ListingService } from '../../providers/listing.service';
import { OrderService } from '../../providers/order.service';

import { OrderCheckoutPage } from '../order-checkout/order-checkout';
import { ProfileFormAddressPage } from '../profile-form-address/profile-form-address';
import { ProfilePaymentMethodPage } from '../profile-payment-method/profile-payment-method';

import { ListingOrderModel } from '../../models/listing-model';
import { OrderModel } from '../../models/order-model';

@Component({
  selector: 'page-listing-order',
  templateUrl: 'listing-order.html'
})
export class ListingOrderPage {

	public formOrder: FormGroup;
	public listing: any;
	public quantity: number = 1;
  public subtotal: number = 0;

  public userProfile: any;
  public primaryAddress: any;
  public shipping_address: boolean = true;
  public pickup_address: boolean = false;
  public order: OrderModel;
  public order_key: string;

  public availableDays: Array<any> = [];
  public time_range: any;
  public scheduleDays: Array<any> = [];

  constructor(
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
      schedule_day: new FormControl('',Validators.required),
      schedule_time: new FormControl('', Validators.required),
      confirmation: new FormControl(false)
    });
  }

  ionViewWillLoad() {
    this.listing = this.params.get('listing');
    this.order_key = this.params.get('order');

    if(this.listing.delivery){

      this.profileService.getProfile().then((fatchProfile) => {
        fatchProfile.on("value", (profileSnap) =>{
          if(profileSnap.val()){
            this.userProfile = profileSnap.val();

            if(this.userProfile.addresses !== undefined ){
              this.primaryAddress = this.userProfile.addresses.find(function(address){
                return address.primary == true;
              });
            }

          }
        });
      },(error) => {
        console.log(error.message);
      });

    }else{

      this.formOrder.patchValue({delivery_option: "Carryout"});
      this.shipping_address = false;
      this.pickup_address = true;

      console.log("JUST Carryout",this.listing);
    }

    // Set the date availability to schedule
    this.setSchedule();
  }

  /**
  *
  */
  ionViewDidLoad() {
    this.subtotal = this.listing.price.main_price;
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
    this.subtotal = (this.listing.price.main_price * quantity);
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
    this.nav.push(ProfileFormAddressPage, { profile: this.userProfile });
  }

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setPaymentMethod() {
    this.nav.push(ProfilePaymentMethodPage, { profile: this.userProfile });
  }


  /**
  * Set the available dates and range of time from 
  * the listing schedule with the next 30 days
  */
  setSchedule() {
    let weekdays = this.listingService.getWeedDays();
    // Process the Schedule object to define the business rules
    this.scheduleDays = this.listing.schedule.map((day, index) => {
      let time_range = [];
      let from = parseInt(day.from_time.split(':')[0]);
      let to   = parseInt(day.to_time.split(':')[0]);
      while(from <= to){
        time_range.push(from);
        from += 1;
      }
      return {day: day.day_number, time_range: time_range.toString()};
    });

    // User a service method to return the available days within the next 30 days.
    this.availableDays = this.listingService.getAvailableDays(this.scheduleDays).map((day) => {
      return day;
      //return weekdays[day.getDay()].label +" "+ (day.getMonth()+1) +"/"+ day.getDate();// +"/"+ day.getFullYear();
    });
  }

  /**
  * Set the time range based on the range for each weekday from the listing
  * @param selectDate - the date from the onChange event of the date select field
  */
  setTimeRange(selectDate) {
    let date = new Date(selectDate);
    this.time_range = this.scheduleDays.find((obj) => {
      return obj.day == date.getDay();
    });
  }

  /**
  *
  */
  checkoutOrder() {
    if(this.formOrder.valid) {

      this.order = new OrderModel();

      //Process the order scheduleDay
      let order_schedule = new Date(this.formOrder.value.schedule_day);
      let schedule_time = this.formOrder.value.schedule_time.split(":");
      order_schedule.setHours(schedule_time[0]);
      order_schedule.setMinutes(schedule_time[1]);
      order_schedule.setSeconds(0);;

      // Base listing data
      let summarized_listing = this.listingService.summarizeListing(this.listing);
      this.order.listing = summarized_listing;

      // Form data
      this.order.quantity = this.formOrder.value.quantity;
      this.order.delivery_option = this.formOrder.value.delivery_option;
      this.order.total_price = this.formOrder.value.total_price;
      this.order.subtotal = this.subtotal;
      this.order.schedule = order_schedule.getTime();

      if(this.order.delivery_option == "Delivery"){
        this.order.delivery_address = this.primaryAddress;
      }
      this.order.buyer_uid = this.userProfile.uid;
      this.order.seller_uid = this.listing.uid;

      // Set the order status
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.open;
      // Set the order status history
      this.order.status_history.push(order_labels.open);

      if(this.order_key){
        this.orderService.updateOrder(this.order_key, this.order).then(()=>{
          console.log(this.order);
          this.nav.push(OrderCheckoutPage, { order: this.order });
        })
        .catch((error)=>{
          console.log(error.message);
        });
      }else{
        // Save the data to the database
        this.orderService.createOrder(this.order).then((result)=>{
          this.order_key = result.key;
          this.nav.push(OrderCheckoutPage, { order_key: this.order_key, order: this.order});
        }).catch((error)=>{
          console.log(error.message);
        });
      }

    }

  }

}
