import { Component } from '@angular/core';
import { ViewController, NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../providers/auth.service';
import { BaseProvider } from '../../app/base.provider';

import { ListingPage } from '../listing/listing';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {

  public login: FormGroup;
  public loading: any;
  public main_page: { component: any };

  constructor(
    private _auth: AuthService,
    public BaseApp: BaseProvider,
    public viewCtrl: ViewController,
    public nav: NavController,
    public loadingCtrl: LoadingController
  ){

    this.main_page = { component: TabsNavigationPage };

    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

  }

  signInUser(){

    let credentials = this.login.value;
    this._auth.signInUser(credentials).then((authUser) => {

      
      console.log("Logged User >>>> ", authUser);
      this._auth.setCurrentUser(authUser).then((user) => {

        //this.nav.removeView(this.viewCtrl);

      });

     
    })
    .catch((error) => {
      this.loading.dismiss().then( () => {
        let title = "User Not Found";
        let msg = "Ops! We could not find your credentials. Please Try again." ;
        this.BaseApp.showAlert(title, msg);
      });
    });

    this.nav.setRoot(TabsNavigationPage);

    // this.loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    // this.loading.present();
  }

  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then( () => { 
        //this.onSignInSuccess();
      } );
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
