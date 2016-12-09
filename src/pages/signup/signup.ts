import { Component } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { BaseProvider } from '../../app/base.provider';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

import { AuthService } from '../../providers/auth.service';
// import { AngularFire } from 'angularfire2';

import { UserModel } from '../../app/models/user.model';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {

  // Properties
  private user: UserModel;

  signup: FormGroup;
  main_page: { component: any };

  constructor(
    public nav: NavController,
    public BaseApp: BaseProvider,
    public modal: ModalController,
    private _auth: AuthService
  ){

    this.main_page = { component: TabsNavigationPage };

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
      confirm_password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required]))
    }, this.localValidator );

  }

  registerUser(){

    let user = this.signup.value

    this._auth.registerUser(user)
      .then((authState) => {
        authState
        console.log(authState);
        //this.onSignInSuccess();
      })
      .catch((error) => {
        console.log(error);

        let title = "User not Registred";
        let msg = "We could not registre you, plase try again.";
        this.BaseApp.showAlert(title, msg);
      });


  }

  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then( () => this.onSignInSuccess() );
  }

  private onSignInSuccess(): void {
    this.nav.setRoot(this.main_page.component);
  }

  signInWithGoogle() {
    this.nav.setRoot(this.main_page.component);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  private localValidator(group: FormGroup): any{
    return group.get('password').value === group.get('confirm_password').value ? null : {'mismatch': true};
  }

}
