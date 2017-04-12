import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

// import { Observable } from 'rxjs/Observable';

import { Storage } from '@ionic/storage';
import { DataService } from './data.service';
import { ProfileModel } from '../models/profile-model';


@Injectable()
export class AuthService {


  public fireAuth: any;
  private PROFILE_REF: string = "profiles/";
  private CURRENT_USER = "current_user";
  private user: any;

  // Current user property
  public currentUser: any;


  constructor(
    public events: Events, 
    private _dataService: DataService, 
    private storage: Storage
  ){
    this.fireAuth = this._dataService.auth;

    // Publish a event to retriave the logged user from the firabase Observable
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.events.publish('user:currentUser', this.user);
      } else {
        return undefined;
      }
    });

  }

  /**
  * After logged in publish a event with the logged user and 
  * store it into the local storage. 
  * @param userProfile - the user profile to be stored
  */
  setCurrentUser(currentUser){
    if(currentUser){
      //set current user property
      this.currentUser = currentUser;
      // stringify and store the user profile
      currentUser = JSON.stringify(currentUser);
      return this.storage.set(this.CURRENT_USER, currentUser);
    }
  }

  /**
  * Get the logged user from the device database storage
  */
  getCurrentUser(){
    return this.storage.get(this.CURRENT_USER).then((currentUser) => {
      return JSON.parse(currentUser);
    });
  }


  /**
  * Sign In the user with email and password credencials
  * @param credencials - An object with email and password 
  */
  signInUser(credencials): any{
    return this.fireAuth.signInWithEmailAndPassword(credencials.email, credencials.password).then((authUser) => {
      return Promise.all([authUser, this._dataService.database.child(this.PROFILE_REF + authUser.uid)]);
    });
  }

  /**
  * Sign Up a new  user with email and password credencials and create a mockup Profile
  * @param user - User credencials An object with email and password 
  */
  signUpUser(user): any{
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password).then((newUser) => {
      return Promise.all([newUser, this.createProfileMockup(newUser)]);
    });
 	}

  /**
  * Create a mockup profile based in the new user
  * @param newUser - An object with the new user from singup method 
  */
  createProfileMockup(newUser){
    let userProfile: ProfileModel = new ProfileModel();
    userProfile.email = newUser.email;
    userProfile.uid = newUser.uid;

    console.log(" User createProfileMockup", userProfile);
    return this._dataService.database.child(this.PROFILE_REF + newUser.uid).set(userProfile);
  }

  /**
  * Login system using Facebook Auth service.
  */
  signInWithFacebook(): any{
  	// return this.auth$.login({
  	// 	provider: AuthProviders.Facebook,
  	// 	method: AuthMethods.Popup
  	// });
  }

  /**
  * Sign upt the current user
  */
  signOut(){
  	this.fireAuth.signOut().then(() => {
      this.storage.set(this.CURRENT_USER, null);
      this.events.publish('user:signout');
    }).catch((error) => {
      console.log("Error trying to log out", error);
    });
    
  }

  /**
  * Reset the password using the firabe password reset Servici
  * @param email - The user email which will be used to send the encrypted passord reset link
  */
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
  * Hendle the exeption in a standart approach
  * @param error - Exception throwed the any method that user handderError()
  */
  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
