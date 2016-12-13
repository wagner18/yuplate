import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ProfileModel } from '../profile/profile.model';
import { BaseProvider } from '../../app/base.provider';


import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'profile-form-page',
  templateUrl: 'profile-form.html'
})
export class ProfileFormPage {


  ProfileForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  public profile: ProfileModel = new ProfileModel();
  public profile_image: string = this.profile.image;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public BaseApp: BaseProvider,
    public profileService: ProfileService
  ){

    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });

    this.ProfileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      gender: new FormControl(),
      birthday: new FormControl(),
      about: new FormControl(),
      location: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  }


  ionViewWillEnter() {

    console.log("Profile Model >>> ",this.profile);

    this.loading.present();
    this.profileService.getProfile().then((promises) => {

      promises[1].on('value', snapshot => {

        if(snapshot.val() == null){

          this.profileService.saveProfile(this.profile).then((profile) =>{
            this.profile = profile;

            this.profile_image = this.profile.image;
            this.setProfile(this.profile);
          })
          .catch((error) => {
            console.log("TREAT THE ERROR! error saving profile", error);
          });

        }else{
          this.profile = snapshot.val();

          this.profile_image = this.profile.image;
          this.setProfile(this.profile);
        }
    
        this.loading.dismiss();
      });

    });
  }


  saveProfile(){
    if(this.ProfileForm.valid){
      console.log(this.ProfileForm.value);
       this.profileService.saveProfile(this.ProfileForm.value).catch((error) => {

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
      this.ProfileForm.setValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          birthday: profile.birthday,
          about: profile.about,
          location: profile.location,
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
