import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

import firebase from 'firebase';

import { ProfileModel } from '../pages/profile/profile.model';

@Injectable()
export class ProfileService {

	private currentUser: any;
  private profile:any;
  private PROFILE_REF: string = "/profiles"; 

  constructor(public http: Http, private _auth: AuthService) {
  	// this._auth.getCurrentUser().then((userData) => {
   //    this.currentUser = userData;
   //  });
  }

  getProfile(){

    if(this.currentUser){

      let pathProfile = this.PROFILE_REF + "/" + this.currentUser.uid;

      //return this.agularFire.database.object(pathProfile, { preserveSnapshot: true });

    }else{
      return null;
    }

  }

  saveProfile(profileModel){

    //this.profile = this.agularFire.database.list(this.PROFILE_REF);

    // profileModel.uid = this.currentUser.uid;
    // this.profile.update(profileModel.uid, profileModel);
    
    // console.log("This is the ID of my user ===>>>", profileModel);

    //this.firebase.database.list(this.collection, { query: query });

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
