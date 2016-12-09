import { Injectable } from '@angular/core';

//import { AuthProviders, FirebaseAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { DataService } from './data.service';


@Injectable()
export class AuthService {


  private fireAuth: any;
  private userProfile: any;
  private PROFILE_REF: string = "/profiles";

  private CURRENT_USER = "current_user";
	private authState: any;




  constructor(
    private localStorage: Storage,
    private _data: DataService
  ) {

    this.fireAuth = this._data.auth;
    //this.userProfile = this._data.database.child(this.PROFILE_REF);
  	// auth$.take(1).subscribe((state: FirebaseAuthState) => {
  	// 	this.authState = state;
  	// });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  setCurrentUser(authState){
      if(authState){
        console.log("This is the Auth State >>>>> ", authState);
        this.localStorage.set(this.CURRENT_USER, authState);
      }
  }

  getCurrentUser(){
    return this.localStorage.get(this.CURRENT_USER);
  }

  signInUser(credencials): any{

    return this.fireAuth.signInWithEmailAndPassword(credencials.email, credencials.Password);

		// return this.auth$.login(credencials, {
		// 	provider: AuthProviders.Password,
		// 	method: AuthMethods.Password
		// });

  }

  registerUser(user): any{

  	// return this.fireAuth.createUser(user)
  	// .then((authState) => { authState; });

 	}

  signInWithFacebook(): any{
  	// return this.auth$.login({
  	// 	provider: AuthProviders.Facebook,
  	// 	method: AuthMethods.Popup
  	// });
  }

  signOut(): void {
  	// this.auth$.logout();
    this.localStorage.set(this.CURRENT_USER, null);
  }

  displayName(): string {
  	if(this.authState !== null){
  		return this.authState.facebook.displayName;
  	}else{
  		return 'No name';
  	}
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
