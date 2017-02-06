import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Nav, App, Tabs } from 'ionic-angular';

import { DataService } from '../../providers/data.service';
import { AuthService } from '../../providers/auth.service';

import { WalkthroughPage } from '../walkthrough/walkthrough';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {

  //@ViewChild(Nav) nav: Nav;

  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  public pages: Array<{title: string, icon: string, component: any}>;
  public pushPages: Array<{title: string, icon: string, component: any}>;
  public current_user: any = {email: "annonymous"};

  constructor(
    private _authService: AuthService,
    public app: App,
    public nav: NavController,
    public menu: MenuController
  ){
    this.tab1Root = ProfilePage;
    this.tab2Root = ListingPage;


    this.pages = [
      { title: 'Home', icon: 'home', component: TabsNavigationPage },
    ];

    this.pushPages = [
      { title: 'Settings', icon: 'settings', component: SettingsPage }
    ];

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
