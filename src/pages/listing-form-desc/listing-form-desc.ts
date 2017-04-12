import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-listing-form-desc',
  templateUrl: 'listing-form-desc.html'
})
export class ListingFormDescPage {

	public formDescription: FormGroup;
	public data: any;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams
  ){

  	this.formDescription = new FormGroup({
      title: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    this.formDescription.setValue({
    	title: this.data.title,
    	summary: this.data.summary,
    	description: this.data.description
    });
  }

  save() {
		this.data.title = this.formDescription.value.title;
    this.data.summary = this.formDescription.value.summary;
    this.data.description = this.formDescription.value.description;

		if(this.formDescription.valid){
			this.data.form_control.description = true;
		}else{
			this.data.form_control.description = false;
		}
		this.viewCtrl.dismiss(this.data);
	}

  cancel() {
    this.viewCtrl.dismiss(null);
  }
  

}
