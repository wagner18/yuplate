import { Injectable } from '@angular/core';
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

  constructor(
    private _dataService: DataService, 
    private _auth: AuthService
  ){  }


  getProfile(){
    return this._auth.getCurrentUser().then((currentUser) => {
      return Promise.all([currentUser, this.fetchProfile(currentUser)]);
    });
  }

  getShortPrifile(uid){
    let refShortProfile = this.SHORT_PROFILE_REF + uid;
    return this._dataService.database.child(refShortProfile);
  }


  fetchProfile(currentUser){
    let refProfile = this.PROFILE_REF + currentUser.uid;
    return this._dataService.database.child(refProfile);
  }

  saveShortProfile(uid, data){
    return this._dataService.database.child(this.SHORT_PROFILE_REF + uid).update(data);
  }

  saveProfile(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.uid = currentUser.uid;
      return this._dataService.database.child(this.PROFILE_REF + currentUser.uid).update(data);
    });
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
