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
    console.log(this.data);

    this.formDescription.setValue({
    	title: this.data.title,
    	summary: this.data.summary,
    	description: this.data.description
    });
  }

  dismiss() {
		let data = this.formDescription.value;
		if(this.formDescription.valid){
			data.valid = true;
		}else{
			data.valid = false;
		}
		this.viewCtrl.dismiss(data);
	}

}
