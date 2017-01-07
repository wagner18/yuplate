import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';



@Component({
  selector: 'page-listing-form-details',
  templateUrl: 'listing-form-details.html'
})
export class ListingFormDetailsPage {

	public formDetails: FormGroup;
	public data: any;

	categories_checkbox_open: boolean;
  categories_checkbox_result;
  categories: Array<any> = [];

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
  	public params: NavParams
  ){

  	this.formDetails = new FormGroup({
  		delivery: new FormControl(),
      carryout: new FormControl(),
      servings: new FormControl(2, counterRangeValidator(7, 1)),
      from_date: new FormControl('2016-09-18', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');
    console.log(this.data);

    // this.formDetails.setValue({
    // 	delivery: this.data.delivery,
    // 	carryout: this.data.carryout,
    // 	servings: this.data.servings
    // });
  }

  dismiss() {
		let data = this.formDetails.value;
		if(this.formDetails.valid){
			data.valid = true;
		}else{
			data.valid = false;
		}
		this.viewCtrl.dismiss(data);
	}

	chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Categories');

    alert.addInput({
      type: 'checkbox',
      label: 'Steak',
      value: 'Steak'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Chicken',
      value: 'Chicken'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }

}
