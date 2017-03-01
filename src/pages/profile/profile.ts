import { Component, Input } from '@angular/core';
import { NavController, MenuController, SegmentButton, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';

import { ProfileFormPage } from '../profile-form/profile-form';
import { ProfileFormAddressPage } from '../profile-form-address/profile-form-address';

import { ListingUserPage } from '../listing-user/listing-user';
import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';

import 'rxjs/Rx';

import { ProfileModel } from '../../models/profile-model';
import { BaseProvider } from '../../app/base.provider';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @Input()  src: string;

  public loading: any;
  public display: string;
  public profile: ProfileModel = new ProfileModel();

  public primaryAddress: any;

  constructor(
    public menu: MenuController,
    public nav: NavController,
    public navParams: NavParams,
    public BaseApp: BaseProvider,
    public profileService: ProfileService,
    public loadingCtrl: LoadingController
  ){

    this.display = "list";
    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
  }

  ionViewWillLoad() {

    this.loading.present();
    // Set a observabole to fecth the updated profile object
    this.profileService.fetchProfile().on("value", (profileSnap) =>{

      if(profileSnap.val()){
        console.log('PPPP LOADAD!!!!!!!!!!', profileSnap.val());
        this.profile = profileSnap.val();

        if(this.profile.addresses !== undefined ){
          this.primaryAddress = this.profile.addresses.find(function(address){
            return address.primary == true;
          });
        }
        this.loading.dismiss();
      }

    }, (error) => {
      console.log(error.message);
    });
  
  }

  goToFollowersList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.followers
    // });
  }

  goToFollowingList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.following
    // });
  }

  goToUserListing(){
    this.nav.push(ListingUserPage);
  }

  editProfile() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.push(ProfileFormPage);
  }

  /**
  * Show the profile shipping address screen
  */
  profileAddress() {
    this.nav.push(ProfileFormAddressPage, { profile: this.profile });
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }
}
