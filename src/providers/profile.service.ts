import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ProfileModel } from '../pages/profile/profile.model';

@Injectable()
export class ProfileService {

	
  private PROFILE_REF: string = "profiles/";
  private currentUser: any;
  public profile: ProfileModel = new ProfileModel();

  constructor(
    public http: Http, 
    private _dataService: DataService, 
    private _auth: AuthService
  ){  }

  getProfile(){
    return this._auth.getCurrentUser().then((currentUser) => {
      return Promise.all([currentUser, this.fetchProfile(currentUser)]);
    });
  }

  fetchProfile(currentUser){
    let pathProfile = this.PROFILE_REF + "/" + currentUser.uid;
    return this._dataService.database.child(pathProfile);
  }

  saveProfile(profile){

    return this._auth.getCurrentUser().then((currentUser) => {

      profile.uid = currentUser.uid;

      let profileData = {};
      profileData[currentUser.uid] = profile;
      console.log("This is the ID of my user ===>>>", profile);
      
      return this._dataService.database.child(this.PROFILE_REF).update(profileData);

    });


  }


  getData(): Promise<ProfileModel> {
    return this.http.get('../assets/example_data/profile.json')
     .toPromise()
     .then(response => response.json() as ProfileModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
