import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the UserListing page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-listing',
  templateUrl: 'user-listing.html'
})
export class UserListingPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello UserListingPage Page');
  }

}
