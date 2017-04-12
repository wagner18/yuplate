import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ListingService } from '../../providers/listing.service';
import { ScheduleModel } from '../../models/listing-model';

/**
* Define an inter modal to the Schedule
*/
@Component({
  selector: 'form-schedule-modal',
  templateUrl: 'form-schedule-modal.html'
})
export class ScheduleModalPage {

  public formScheduleModal: FormGroup;
	public data: any;
  public weekDays: any;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
    private listingService: ListingService
  ){

    this.data = new ScheduleModel();

  	this.formScheduleModal = new FormGroup({
      day: new FormControl('', Validators.required),
      from_time: new FormControl('08:00', Validators.required),
      to_time: new FormControl('17:00', Validators.required)
    });
  }

  ionViewDidLoad() {
    // Categories - Take it to the right place
    this.weekDays = this.listingService.getWeedDays();

    let data = this.params.get('data');
    if(data){
      this.data = data;
      this.formScheduleModal.setValue({
        day: data.day,
        from_time: data.from_time,
        to_time: data.to_time
      });
    }

  }

  /**
  * Cancel and close the modal
  */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
  * Check if the form is valid, dismiss the modal and send back the data to 
  * the Schedule page be handle the database storage
  */
  save() {

    if(this.formScheduleModal.valid) {
      // Set the week day as String and number to be used with data() object
      this.data.day_number = this.formScheduleModal.value.day;
      this.data.day = this.weekDays[this.formScheduleModal.value.day].label;

      this.data.from_time = this.formScheduleModal.value.from_time;
      this.data.to_time = this.formScheduleModal.value.to_time;
    }else{
      this.data = null;
    }
		this.viewCtrl.dismiss(this.data);
	}

}