import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ProfileModel } from '../pages/profile/profile.model';

@Injectable()
export class ProfileService {

	
  private PROFILE_REF: string = "profiles/";
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


  fetchProfile(currentUser){
    let refProfile = this.PROFILE_REF + currentUser.uid;
    return this._dataService.database.child(refProfile);
  }


  saveProfile(profile){
    return this._auth.getCurrentUser().then((currentUser) => {
      profile.uid = currentUser.uid;
      return this._dataService.database.child(this.PROFILE_REF + currentUser.uid).update(profile);
    });
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
