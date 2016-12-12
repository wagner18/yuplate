import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, App, Tabs } from 'ionic-angular';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {

  @ViewChild('nTabs') tabRef: Tabs;

  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor() {
    this.tab1Root = ProfilePage;
    this.tab2Root = ListingPage;
    this.tab3Root = NotificationsPage;
  }
}
