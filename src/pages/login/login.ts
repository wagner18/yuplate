import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { BaseProvider } from '../../app/base.provider';

import { AuthService } from '../../providers/auth.service';
// import { AngularFire, FirebaseAuthState} from 'angularfire2';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {

  login: FormGroup;
  main_page: { component: any };
  private authUser: any;

  constructor(
    public nav: NavController,
    public BaseApp: BaseProvider,
    private _auth: AuthService
  ){

    this.main_page = { component: TabsNavigationPage };

    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

  }

  loginUser(){

    let credentials = this.login.value;

    this._auth.signInUser(credentials)
    .then((authUser) => {
      this.authUser = authUser;

      this._auth.setCurrentUser(this.authUser);

      console.log("Logged User >>>> ", this.authUser);
      
      this.onSignInSuccess();
    })
    .catch((error) => {

      let title = "User Not Found";
      let msg = "Ops! We could not find your credentials. Please Try again." ;

      this.BaseApp.showAlert(title, msg);

    });

  }

  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then( () => this.onSignInSuccess() );
  }

  private onSignInSuccess(): void {
    console.log('User Logged');
    this.nav.setRoot(this.main_page.component);
  }

  signInWithGoogle() {
    this.nav.setRoot(this.main_page.component);
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
