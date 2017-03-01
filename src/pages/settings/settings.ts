import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ProfileModel } from '../../models/profile-model';
import { BaseProvider } from '../../app/base.provider';


import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {


  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  public profile: ProfileModel = new ProfileModel();

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public BaseApp: BaseProvider,
    public profileService: ProfileService
  ){

    this.loading = this.loadingCtrl.create();

    this.settingsForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      about: new FormControl(),
      location: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  }


  ionViewDidLoad() {

    // this.profile = this.profileService.getProfile();
    // if(this.profile !== undefined) {
    //   this.setProfile(this.profile);
    // }

    this.loading.present();
    this.profile = this.profileService.getCurrentProfile();
    this.setProfile(this.profile);
    this.loading.dismiss();

    // this.loading.present();
    // this.profileService.getProfile().then((promises) => {
    //   promises[1].on('value', snapshot => {
    //     if(snapshot.val() == null){
    //       this.profileService.saveProfile(this.profile).then((profile) =>{
    //         this.profile = profile;
    //         this.setProfile(this.profile);
    //       })
    //       .catch((error) => {
    //         console.log("TREAT THE ERROR! error saving profile", error);
    //       });
    //     }else{
    //       this.profile = snapshot.val();
    //       this.setProfile(this.profile);
    //     }
    //     this.loading.dismiss();
    //   });
    // });

  }


  saveProfile(){
    if(this.settingsForm.valid){
      console.log(this.settingsForm.value);
       this.profileService.saveProfile(this.settingsForm.value).catch((error) => {

          let title = "Ops! Sorry about that";
          let msg = "We couldn't save the profile information, please check your connection" ;
          this.BaseApp.showAlert(title, msg);
          
       });
    }else{
      alert("Error");
    }
  }


  setProfile(profile){
    if(profile){
      this.settingsForm.setValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          location: profile.location,
          about: profile.about,
          currency: 'dollar',
          weather: 'fahrenheit',
          notifications: true
        });
     }
  }

  logout() {
    // navigate to the new page if it is not the current page
    console.log("Implement the logout methos from here");
    //this.nav.setRoot(this.rootPage);
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
