import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from 'ionic-native';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ProfileModel } from '../models/profile-model';

@Injectable()
export class ProfileService {
	
  private currentUser: any;
  private profile: ProfileModel = new ProfileModel();

  private PROFILE_REF: string = "profiles/";
  private SHORT_PROFILE_REF: string = "short_profiles/";


  constructor(
    private _dataService: DataService, 
    private _auth: AuthService,
    private storage: Storage,
    private events: Events
  ){  

    // subscribe to the event publish by the firabase observable onAuthStateChanged
    this._auth.getCurrentUser().then((currentUser) => {
      if(currentUser !== null){
        this.setCurrentUser(currentUser);

        this.fetchProfile().on('value', profileSnap => {
          if(profileSnap.val()){
            this.setProfile(profileSnap.val());
          }
        }, (error) => {
          console.log(error.message);
        });
      }
    });

  }

  /**
  * Set current user
  * @param currentUser - Firebase auth current user
  */
  setCurrentUser(currentUser){
    this.currentUser = currentUser;
  }


  /**
  * Return the current profile, if in memory, return the current object
  * if no, get from local storage.
  */
  getCurrentProfile() {
    if(this.profile.uid !== undefined){
      return this.profile;
    }else{
      return undefined;
    }
  }

  /**
  *
  */
  setProfile(profile) {
    if(profile.uid !== undefined){
      //Update the profile local property
      this.profile = profile;
      // Set the event to listen the profile changings
      this.events.publish('profile:changed', this.profile);
      // stringify and store the user profile
      // profile = JSON.stringify(profile);
      // return this.storage.set(this.LOCAL_PROFILE, profile);
    }
  }

  /**
  *
  */
  getShortPrifile(uid){
    let refShortProfile = this.SHORT_PROFILE_REF + uid;
    return this._dataService.database.child(refShortProfile);
  }
  saveShortProfile(uid, data){
    return this._dataService.database.child(this.SHORT_PROFILE_REF + uid).update(data);
  }


  /**
  * Fetch a profile form the data base usinge the logged user object
  */
  fetchProfile(){
    if(this.currentUser.uid !== undefined){
      let refProfile = this.PROFILE_REF + this.currentUser.uid;
      return this._dataService.database.child(refProfile);
    }else{
      console.log("None user founded");
    }
  }

  /**
  * Save the user profile adding the user uid by default
  * @param data - Profile data to be stored
  */
  saveProfile(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.uid = currentUser.uid;
      return this._dataService.database.child(this.PROFILE_REF + currentUser.uid).update(data);
    });
  }

  /**
  * update a specific profile property based on the database reference
  * @param profile_ref - Profile database reference path
  * @param data - Profile data to be stored
  */
  updateProfile(profile_ref, data){
    return this._dataService.database.child(this.PROFILE_REF + profile_ref).set(data);
  }

  /*
  * remove a specific reference from the database node
  * @param reference - Node reference path to the item to be removed
  */
  removeReference(reference){
    if(reference){
      return this._dataService.database.child(this.PROFILE_REF + reference).remove();
    }  
  }


  /**
  * Return a promise with the resolved upload task snapshot or reject
  */
  uploadPicutre(image, uid){
    let imageRef = "profiles/" + uid + "/profilepic_" + uid + ".jpg";;
    return new Promise((resolve, reject) => {

      let upTask = this._dataService.imageRef().child( imageRef ).put(image);
      upTask.on('state_changed', function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      function(error) {
        reject(error);
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        resolve(upTask.snapshot.downloadURL);
      });
    });
  }

  /**
  * Set the profile current location
  */
  setCurrentLocation(){
    return Geolocation.getCurrentPosition({ maximumAge: 5000, timeout: 15000, enableHighAccuracy: true }).then((position) => {

      let current_location = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.profile.location = current_location;

      return this.profile;

    }, (error) => {
      console.log(error);
      alert("We couldn't get your location, please check your internet.");
    });
  }

  /**
  *
  */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
