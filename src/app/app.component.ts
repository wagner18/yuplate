/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Root component for the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 11/13/2016
*/

import { Component, ViewChild, Input} from '@angular/core';
import { Platform, Events, MenuController, Nav, App } from 'ionic-angular';
import { Keyboard, StatusBar, Splashscreen } from 'ionic-native';

import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth.service';
import { ProfileService } from '../providers/profile.service';

import { MapProvider } from '../providers/map-provider';

import { BaseProvider } from './base.provider';

import { ListingPage } from '../pages/listing/listing';
import { ProfilePage } from '../pages/profile/profile';
import { ProfileOrdersPage } from '../pages/profile-orders/profile-orders';
import { ListingUserPage } from '../pages/listing-user/listing-user';

import { SellerPage } from '../pages/seller/seller';

import { LoginPage } from '../pages/login/login';

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
  public rootPage: any = WalkthroughPage;// LoginPage;// = TabsNavigationPage; // = WalkthroughPage;
  public main_page: { component: any };

  public pages: Array<{title: string, icon: string, component: any, type: string}>;

  public profileName: string;
  public profileLocation: string;
  public profileImage: string;

  constructor(
    public platform: Platform,
    public events: Events,
    public BaseApp: BaseProvider,
    public app: App,
    public map: MapProvider,
    public menu: MenuController,
    private _dataService: DataService,
    private _authService: AuthService,
    private _profileService: ProfileService
  ){

    this.initializeApp();

    this.main_page = { component: ListingPage };

    this.pages = [
      { title: 'Home', icon: 'ios-home-outline', component: ListingPage, type: 'root' },
      { title: 'My Orders', icon: 'ios-bookmarks-outline', component: ProfileOrdersPage, type: 'push'},
      { title: 'Subscription', icon: 'ios-create-outline', component: ListingUserPage, type: 'push'},
      { title: 'Seller', icon: 'ios-briefcase-outline', component: SellerPage, type: 'root'},
      { title: 'Listings', icon: 'ios-add-circle-outline', component: ListingUserPage, type: 'push'},
      { title: 'Drivers Pool', icon: 'ios-car-outline', component: ListingUserPage, type: 'push'},
      { title: 'Profile', icon: 'ios-contact-outline', component: ProfilePage, type: 'root'}
    ];
  }

  initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();
      StatusBar.styleDefault();

      // Set the map library
      this.map.setMap();

      // no need anymore
      if (this.platform.is('ios')) {
        Keyboard.hideKeyboardAccessoryBar(false);
        //Keyboard.disableScroll(true); 
      } 

    });
  }

  ngOnInit(){
    // subscribe to the event publish by the firabe observable onAuthStateChanged
    this.events.subscribe('user:currentUser', (currentUser) => {
      this.loadProfile(currentUser);
      this.events.unsubscribe('user:currentUser');
    });

    // subscribe to the signin events for the authService
    this.events.subscribe('user:signin', (currentUser) => {
      this.loadProfile(currentUser);
      this.events.unsubscribe('user:signin');
    });

    // subscribe to the profile updated events
    this.events.subscribe('profile:changed', (profile) => {
      this._setProfile(profile);
      // this.events.unsubscribe('profile:changed');
    });

  }

  /**
  * Load the profile from the database
  * @param currentUser - The logged user
  */
  private loadProfile(currentUser) {
    if(currentUser !== undefined){
      // Set the current user
      this._profileService.setCurrentUser(currentUser);
      this._profileService.fetchProfile().once('value', profileSnap => {
        if(profileSnap.val()){
          this._setProfile(profileSnap.val());

          // Set the profile to the local storage
          this._authService.setCurrentUser(currentUser).then(() => {
            this._profileService.setProfile(profileSnap.val());
            this.nav.setRoot(ListingPage);
          });
        }
      }, (error) => {
        console.log(error.message);
      });
    }
  }

  /**
  *
  */
  private _setProfile(userProfile){
    this.profileName = userProfile.firstName;
    this.profileLocation = userProfile.location;
    this.profileImage = userProfile.image;
  }

  /**
  * Set the navagation through the side menu
  * @param page = page object listed within the side menu
  */
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close().then(() => {
      // navigate to the new page if it is not the current page
      if(page.type === "root"){
        this.nav.setRoot(page.component);
      }
      else if(page.type === "push"){
        this.app.getRootNav().push(page.component);
      }
    });

  }

  logout(){
    this._authService.signOut();
    this.menu.close();
    this.nav.setRoot(LoginPage);
  }

}
