import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { DataService } from './data.service';


@Injectable()
export class AuthService {



  private PROFILE_REF: string = "/profiles";
  private CURRENT_USER = "current_user";
  public fireAuth: any;
  private userProfile: any;



  constructor(private _dataService: DataService, private storage: Storage) {

    this.fireAuth = this._dataService.auth;
    this.userProfile = this._dataService.database.child(this.PROFILE_REF);
  }

  get authenticated(): boolean {
    return this.fireAuth.auth !== null;
  }

  setCurrentUser(authUser){
    if(authUser){
      this.storage.set(this.CURRENT_USER, authUser);
    }
  }

  getCurrentUser(){
    return this.storage.get(this.CURRENT_USER);
  }

  signInUser(credencials): any{
    return this.fireAuth.signInWithEmailAndPassword(credencials.email, credencials.password);
  }

  createUser(user): any{
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password);
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

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
