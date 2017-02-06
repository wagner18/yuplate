import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ProfileModel } from '../models/profile-model';

@Injectable()
export class ProfileService {
	
  private PROFILE_REF: string = "profiles/";
  private SHORT_PROFILE_REF: string = "short_profiles/";
  private currentUser: any;
  public profile: ProfileModel = new ProfileModel();
  private LOCAL_PROFILE = "local_profile";

  constructor(
    private _dataService: DataService, 
    private _auth: AuthService,
    private storage: Storage
  ){  

    // subscribe to the event publish by the firabe observable onAuthStateChanged
    // this.events.subscribe('user:currentUser', (currentUser) => {
    //   this.fetchProfile(currentUser).on('child_changed', profileSnap => {
    //     if(profileSnap.val()){
          

    //       this.events.unsubscribe('user:currentUser');
    //     }
    //   }, (error) => {
    //     console.log(error.message);
    //   });
    // });

    this._auth.getCurrentUser().then((currentUser) => {
      if(currentUser !== null){
        this.fetchProfile(currentUser).on('value', profileSnap => {
          if(profileSnap.val()){
            console.log('Profile Changed!!!!!!!!!!', profileSnap.val());

            this.profile = profileSnap.val();
            this.setLocalProfile(profileSnap.val());
          }
        }, (error) => {
          console.log(error.message);
        });
      }
    });

  }

  /**
  * Return the current profile
  */
  getProfile() {
    return this._auth.getCurrentUser().then((currentUser) => {
      return this.fetchProfile(currentUser);
    });
  }

  /**
  * Fetch a profile form the data base usinge the logged user object
  * @param currentUser - User object
  */
  fetchProfile(currentUser){
    if(currentUser){
      let refProfile = this.PROFILE_REF + currentUser.uid;
      return this._dataService.database.child(refProfile);
    }
  }

  /**
  *
  */
  setLocalProfile(profile) {
    if(profile){
      // stringify and store the user profile
      profile = JSON.stringify(profile);
      return this.storage.set(this.LOCAL_PROFILE, profile);
    }
  }

  /**
  *
  */
  getLocalProfile() {
    return this.storage.get(this.LOCAL_PROFILE).then((profile) => {
      return JSON.parse(profile);
    });
  }

  getShortPrifile(uid){
    let refShortProfile = this.SHORT_PROFILE_REF + uid;
    return this._dataService.database.child(refShortProfile);
  }

  saveShortProfile(uid, data){
    return this._dataService.database.child(this.SHORT_PROFILE_REF + uid).update(data);
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


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
