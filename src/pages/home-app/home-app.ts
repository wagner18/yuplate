import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Nav, App } from 'ionic-angular';

import { DataService } from '../../providers/data.service';
import { AuthService } from '../../providers/auth.service';

import { FormsPage } from '../forms/forms';
import { LayoutsPage } from '../layouts/layouts';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'page-home-app',
  templateUrl: 'home-app.html'
})
export class HomeAppPage {

	@ViewChild(Nav) nav: Nav;

	public pages: Array<{title: string, icon: string, component: any}>;
  public pushPages: Array<{title: string, icon: string, component: any}>;
  public currentUser: any = {email: "annonymous"};

  constructor(
  	private _authService: AuthService,
    public app: App,
    // public nav: NavController,
    public menu: MenuController
  ){  }

  ionViewDidLoad() {
  	this._authService.getCurrentUser().then((currentUser) => {
  		this.currentUser = currentUser;
  	});
  }

  logout(){
    this._authService.signOut();
    this.menu.close();
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }

}
