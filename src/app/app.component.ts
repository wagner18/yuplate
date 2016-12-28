/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Root component for the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 11/13/2016
*/

import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { Platform, Events, MenuController, Nav, App } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth.service';

import { BaseProvider } from './base.provider';

import { ListingPage } from '../pages/listing/listing';
import { ProfilePage } from '../pages/profile/profile';
import { ListingUserPage } from '../pages/listing-user/listing-user';
import { ListingFormPage } from '../pages/listing-form/listing-form';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';


import { FormsPage } from '../pages/forms/forms';
import { LayoutsPage } from '../pages/layouts/layouts';
import { NotificationsPage } from '../pages/notifications/notifications';

//import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';

export interface UserProfile  {
  name: string;
  location: string;
  image: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  @Input()  src: string;

  // make WalkthroughPage the root (or first) page
  public rootPage: any;// = TabsNavigationPage; // = WalkthroughPage;
  public main_page: { component: any };

  public pages: Array<{title: string, icon: string, component: any}>;
  public pushPages: Array<{title: string, icon: string, component: any}>;

  public profileName: string;
  public profileLocation: string;
  public profileImage: string;

  constructor(
    public platform: Platform,
    public events: Events,
    public BaseApp: BaseProvider,
    public app: App,
    public menu: MenuController,
    private _dataService: DataService,
    private _authService: AuthService 
  ){

    this.initializeApp();

    this.main_page = { component: ListingPage };

    this.pages = [
      { title: 'Home', icon: 'home', component: ListingPage },
      { title: 'Profile', icon: 'contact', component: ProfilePage } 
    ];

    this.pushPages = [
      { title: 'Listing', icon: 'add-circle', component: ListingUserPage },
      { title: 'Forms', icon: 'create', component: FormsPage },
      { title: 'Layouts', icon: 'grid', component: LayoutsPage },
      { title: 'Settings', icon: 'settings', component: SettingsPage }
    ];
  }

  initializeApp(){
    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();

    });
  }

  ngOnInit(){

    this.events.subscribe('user:signin', (data) => {
      let userProfile = data[0];
      this._setProfile(userProfile);
    });
    
    // Redirect the page case the user is logged in
    this._authService.getCurrentUser().then((userProfile) =>{

      console.log(userProfile);

      if(userProfile !== null){
        this._setProfile(userProfile);
        this.nav.setRoot(ListingPage);
      }else{
        this.nav.setRoot(LoginPage);
      }
    });

  }

  private _setProfile(userProfile){
    this.profileName = userProfile.firstName;
    this.profileLocation = userProfile.location;
    this.profileImage = userProfile.image;
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
