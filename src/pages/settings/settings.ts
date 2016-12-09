import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';
import { AuthService } from '../../providers/auth.service';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import { ProfileModel } from '../profile/profile.model';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  profile: any;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public profileService: ProfileService
  ) {
    this.loading = this.loadingCtrl.create();

    this.settingsForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      location: new FormControl(),
      description: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  }

  ionViewDidLoad() {

    this.loading.present();
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile.val();

      console.log("PROFILE +++++++++",profile.val());

      this.settingsForm.setValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        location: this.profile.location,
        description: this.profile.about,
        currency: 'dollar',
        weather: 'fahrenheit',
        notifications: true
      });

      this.loading.dismiss();
    });

  }

  logout() {
    // navigate to the new page if it is not the current page
    console.log("Implement the logout methos from here");
    //this.nav.setRoot(this.rootPage);
  }

  saveProfile(){

    if(this.settingsForm.valid){
       this.profileService.saveProfile(this.settingsForm.value);
    }
    
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }
}
