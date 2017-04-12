import { Component } from '@angular/core';
import { NavController, ModalController, SegmentButton} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseProvider } from '../../app/base.provider';

import { ListingPage } from '../listing/listing';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';



@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {

  // Properties
  public signup: FormGroup;
  public main_page: { component: any };
  public section: string;

  constructor(
    public nav: NavController,
    public BaseApp: BaseProvider,
    public modal: ModalController,
    private _auth: AuthService,
    private _profile: ProfileService
  ){
    this.section = "personal";
    this.main_page = { component: ListingPage };

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
      confirm_password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required]))
    }, this.localValidator );

  }

  signUpUser(){

    let user = this.signup.value;
    this._auth.signUpUser(user).then((promises) => {
      
      console.log(promises);
      let authUser = promises[0];

      this._auth.setCurrentUser(authUser).then((user) =>{
        this.onSignInSuccess();
      });

    })
    .catch((error) => {
      let title = " Ops! User not Registred ";
      console.log(error);
      this.BaseApp.showAlert(title, error.message);
    });
  }

  /**
  *
  */
  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then( () => this.onSignInSuccess() );
  }

  private onSignInSuccess(){
    this.nav.setRoot(ListingPage);
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
