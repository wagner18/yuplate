import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';

import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';

import 'rxjs/Rx';

import { ProfileModel } from './profile.model';
import { BaseProvider } from '../../app/base.provider';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  loading: any;
  display: string;
  public profile: ProfileModel = new ProfileModel();

  constructor(
    public menu: MenuController,
    public app: App,
    public navParams: NavParams,
    public BaseApp: BaseProvider,
    public profileService: ProfileService,
    public loadingCtrl: LoadingController
  ){

    this.display = "list";
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {

    this.loading.present();

    this.profileService.getProfile().then((promises) => {
      promises[1].on('value', snapshot => {

        if(snapshot.val()){
          this.profile = snapshot.val();
          this.loading.dismiss();
        }
      });

    });
  
  }

  goToFollowersList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.followers
    // });
  }

  goToFollowingList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.following
    // });
  }

  goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(SettingsPage);
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }
}
