import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
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
      from_time: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
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
  *
  */
  dismiss() {

    if(this.formScheduleModal.valid) {     
      this.data.day = this.formScheduleModal.value.day;
      this.data.from_time = this.formScheduleModal.value.from_time;
      this.data.to_time = this.formScheduleModal.value.to_time;
    }else{
      this.data = null;
    }
		this.viewCtrl.dismiss(this.data);
	}

}