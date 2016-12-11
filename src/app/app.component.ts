/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Root component for the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 11/13/2016
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth.service';

import { BaseProvider } from './base.provider';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { FormsPage } from '../pages/forms/forms';
import { LayoutsPage } from '../pages/layouts/layouts';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';



@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
  public rootPage: any;// = WalkthroughPage;
  public main_page: { component: any };

  public pages: Array<{title: string, icon: string, component: any}>;
  public pushPages: Array<{title: string, icon: string, component: any}>;
  public current_user: any = {email: "annonymous"};

  constructor(
    public platform: Platform,
    public BaseApp: BaseProvider,
    public menu: MenuController, 
    public app: App,
    private _dataService: DataService,
    private _authService: AuthService 
  ){

    this.initializeApp();

    this.main_page = { component: TabsNavigationPage };

    this.pages = [
      { title: 'Home', icon: 'home', component: TabsNavigationPage },
      { title: 'Forms', icon: 'create', component: FormsPage }
    ];

    this.pushPages = [
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

    // Redirect the page case the user is logged in
    this._authService.getCurrentUser().then((userData) =>{
      console.log("User on the Local Storage >>>> ", userData);
      if(userData !== null){

        this.current_user = userData;
        this.rootPage = this.main_page.component;

      }else{
        this.rootPage = WalkthroughPage;
      }

    });

  }

  ionViewWillEnter(){
    //console.log(this._authService.authenticated);
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
