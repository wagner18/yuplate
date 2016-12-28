import { Component, Input } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseProvider } from '../../app/base.provider';
import { MediaService } from '../../providers/media.service';

import { ProfileModel } from '../../models/profile-model';


import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'profile-form-page',
  templateUrl: 'profile-form.html'
})
export class ProfileFormPage {

  @Input()  src: string;

  ProfileForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  public profile: ProfileModel = new ProfileModel();
  public tempImage: any;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public BaseApp: BaseProvider,
    public profileService: ProfileService,
    public mediaService: MediaService,
    public actionSheetCtrl: ActionSheetController
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

    //this.loading.present();
    this.profileService.getProfile().then((promises) => {
      promises[1].on('value', snapshot => {
        
        if(snapshot.val()){
          this.profile = snapshot.val();
          this.setProfile(this.profile);
        }
        //this.loading.dismiss();
      });

    });
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

  saveProfile(){
    if(this.ProfileForm.valid){

      var saveTask: Promise<any>;
      var profile = this.ProfileForm.value;

      /**
      * If the is an temp image create a new Blob file and chain 
      * the promises to upload the file and save the profile
      */
      if(this.tempImage){

        let blobFilePromise = this.mediaService.createBlobFile(this.tempImage);
        let uploadTask = blobFilePromise.then((blobFile) =>{
          return this.profileService.uploadPicutre(blobFile, this.profile.uid);
        });

        saveTask = Promise.all([blobFilePromise, uploadTask]).then((results) => {
          console.log('Promises Results',results);
          profile.image = results[1];
          return this.profileService.saveProfile(profile);
        });

      }else{
        saveTask = this.profileService.saveProfile(profile);
      }
      
      saveTask.catch((error) => {
        let title = "Ops! Sorry about that";
        let msg = "We couldn't save the profile information, please check your connection" ;
        this.BaseApp.showAlert(title, error.message);
      });

    }else{
      alert("The profile data is invalid");
    }
  }


  doGetPicture(source){
    if(this.profile.uid){
      this.mediaService.getProfilePicture(source).then((imageURI) => {
        if(imageURI) {
          this.profile.image = imageURI;
          this.tempImage = imageURI;
        }
      });
    }
  }


  cameraActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Take Picture',
          icon: 'camera',
          handler: () => {
            this.doGetPicture("CAMERA");
          }
        },
        {
          text: 'Choose from Library',
          icon: 'images',
          handler: () => {
            this.doGetPicture("LIBRARY");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            actionSheet.dismiss();
          }
        },

      ]
    });
    actionSheet.present();
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
