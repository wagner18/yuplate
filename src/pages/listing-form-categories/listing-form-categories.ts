import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ListingService } from '../../providers/listing.service';

@Component({
  selector: 'page-listing-form-categories',
  templateUrl: 'listing-form-categories.html'
})
export class ListingFormCategoriesPage {

	public formCategories: FormGroup;
	public data: any;
  public categories: Array<any> = [];

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
  	public listingService: ListingService
  ){

    this.categories = this.listingService.getListingCategories();

    // this.formCategories = new FormGroup({
    //   categories: new FormControl('false', Validators.required)
    // });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    console.log("======",this.data);
    if(this.data.categories !== undefined ){

      this.data.categories.forEach(category => {
        for (let i = 0; i < this.categories.length; i++) {
          if(category.checked === true && category.value === this.categories[i].value){
            this.categories[i].checked = true;
            break;
          }
        }
      });
    }
  }

  /**
  *
  */
  save() {

    this.data.categories = [];
	  this.categories.forEach(category =>{
      if(category.checked){
        this.data.categories.push(category);
      }
    });

 
		if(this.data.categories.length > 0){
			this.data.form_control.categories = true;
		}else{
			this.data.form_control.categories = false;
		}
		this.viewCtrl.dismiss(this.data);
	}

  cancel() {
    this.viewCtrl.dismiss(null);
  }

}
