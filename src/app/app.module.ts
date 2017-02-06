/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Root component for the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 11/13/2016
*/

/*
    Import dependencies
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';

/*
    Import Pages
*/
// import { HomeAppPage } from '../pages/home-app/home-app';
import { ListingPage } from '../pages/listing/listing';
import { ListingDetailsPage } from '../pages/listing-details/listing-details';
import { ListingUserPage } from '../pages/listing-user/listing-user';
import { ListingFormPage } from '../pages/listing-form/listing-form';
import { ListingFormDescPage } from '../pages/listing-form-desc/listing-form-desc';
import { ListingFormPricePage } from '../pages/listing-form-price/listing-form-price';
import { ListingFormSchedulePage } from '../pages/listing-form-schedule/listing-form-schedule';
import { ScheduleModalPage } from '../pages/listing-form-schedule/form-schedule-modal';
import { ListingFormDetailsPage } from '../pages/listing-form-details/listing-form-details';
import { ListingOrderPage } from '../pages/listing-order/listing-order';
import { ListingImagesPage } from '../pages/listing-images/listing-images';
import { ImageViewModalPage } from '../pages/image-view-modal/image-view-modal';
import { LocationModalPage} from '../pages/location-modal/location-modal';
import { GalleryModal } from '../pages/gallery-modal/gallery-modal';
import { ProfilePage } from '../pages/profile/profile';
import { ProfileFormPage } from '../pages/profile-form/profile-form';
import { ProfileFormAddressPage } from '../pages/profile-form-address/profile-form-address';
import { ProfilePaymentMethodPage } from '../pages/profile-payment-method/profile-payment-method';
import { AddressFormModal } from '../pages/profile-form-address/address-form-modal';
import { LoginPage } from '../pages/login/login';
import { OrderCheckoutPage } from '../pages/order-checkout/order-checkout';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';


import { CardFormPage } from '../pages/card-form/card-form';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';

import { SettingsPage } from '../pages/settings/settings';


import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';

/*
    Import components directives
*/
import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';
import { ZoomableImage } from '../components/zoomable-image/zoomable-image';

/*
    Import providers
*/
import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth.service';
import { BaseProvider } from './base.provider';
import { MediaService } from '../providers/media.service';
import { ListingService } from '../providers/listing.service';
import { OrderService } from '../providers/order.service';
import { DishService } from '../providers/dish.service';
import { ProfileService } from '../providers/profile.service';


declare var cordova: any;

@NgModule({  
  declarations: [
    MyApp,
    ListingPage,
    ListingDetailsPage,
    ListingOrderPage,
    ListingUserPage,
    ListingFormPage,
    ListingFormDescPage,
    ListingFormPricePage,
    ListingFormSchedulePage,
    ScheduleModalPage,
    ListingFormDetailsPage,
    ListingImagesPage,
    ImageViewModalPage,
    LocationModalPage,
    LoginPage,


    ProfilePage,
    ProfileFormPage,
    ProfileFormAddressPage,
    ProfilePaymentMethodPage,
    AddressFormModal,
    OrderCheckoutPage,
    CardFormPage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,

    TermsOfServicePage,
    PrivacyPolicyPage,
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    GalleryModal,
    ZoomableImage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        menuType: 'overlay',
        spinner: 'dots'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListingPage,
    ListingDetailsPage,
    ListingOrderPage,
    ListingUserPage,
    ListingFormPage,
    ListingFormDescPage,
    ListingFormPricePage,
    ListingFormSchedulePage,
    ScheduleModalPage,
    ListingFormDetailsPage,
    ListingImagesPage,
    ImageViewModalPage,
    LocationModalPage,
    LoginPage,
    ProfilePage,
    ProfileFormPage,
    ProfileFormAddressPage,
    ProfilePaymentMethodPage,
    AddressFormModal,
    OrderCheckoutPage,
    CardFormPage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    ForgotPasswordPage,
    SignupPage,


    TermsOfServicePage,
    PrivacyPolicyPage,
    GalleryModal
  ],
  providers: [
    Storage,
    DataService,
    AuthService,
    BaseProvider,
    MediaService,
    ListingService,
    OrderService,
    DishService,
    ProfileService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
