import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { DataService } from './data.service';
import { ProfileModel } from '../pages/profile/profile.model';


@Injectable()
export class AuthService {



  private PROFILE_REF: string = "profiles/";
  private CURRENT_USER = "current_user";
  public fireAuth: any;
  private userProfile: any;



  constructor(private _dataService: DataService, private storage: Storage) {
    this.fireAuth = this._dataService.auth;
  }

  get authenticated(): boolean {
    return this.fireAuth.auth !== null;
  }

  setCurrentUser(userProfile){
    if(userProfile){
      return this.storage.set(this.CURRENT_USER, userProfile);
    }
  }

  getCurrentUser(){
    return this.storage.get(this.CURRENT_USER);
  }

  signInUser(credencials): any{
    return this.fireAuth.signInWithEmailAndPassword(credencials.email, credencials.password);
  }

  createUser(user): any{
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password).then((newUser) => {
      return Promise.all([newUser, this.createProfileMockup(newUser)]);
    });
 	}

  createProfileMockup(newUser){
    let userProfile: ProfileModel = new ProfileModel();
    userProfile.email = newUser.email;
    userProfile.uid = newUser.uid;

    return this._dataService.database.child(this.PROFILE_REF + newUser.uid).set(userProfile)
    .then((newProfile) => {
       return newProfile;
    });
  }

  signInWithFacebook(): any{
  	// return this.auth$.login({
  	// 	provider: AuthProviders.Facebook,
  	// 	method: AuthMethods.Popup
  	// });
  }

  signOut(){

  	this.fireAuth.signOut().then(() => {
      this.storage.set(this.CURRENT_USER, null);
    }).catch((error) => {
      console.log("Error trying to log out", error);
    });
    
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}