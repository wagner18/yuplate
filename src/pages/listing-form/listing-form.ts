import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ListingPage } from '../listing/listing';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseProvider } from '../../app/base.provider';
import { ListingService } from '../../providers/listing.service';
import { MediaService } from '../../providers/media.service';

import { ItemModel } from '../../models/listing-model';
import { MediaModel } from '../../models/listing-model';

/* Pages */
import { ListingFormDescPage } from '../listing-form-desc/listing-form-desc';
import { ListingFormPricePage } from '../listing-form-price/listing-form-price';
import { ListingFormSchedulePage } from '../listing-form-schedule/listing-form-schedule';
import { ListingFormDetailsPage } from '../listing-form-details/listing-form-details';
import { LocationModalPage, } from '../location-modal/location-modal';
import { ListingImagesPage } from '../listing-images/listing-images';

@Component({
  selector: 'listing-form-page',
  templateUrl: 'listing-form.html'
})
export class ListingFormPage {

  public listing: any;
  public step1Form: FormGroup;

  public description_radio = "radio-button-off";
  public location_radio = "radio-button-off";
  public price_radio = "radio-button-off";
  public schedule_radio = "radio-button-off";
  public details_radio = "radio-button-off";

  public listing_ref: string = null;
  public max_media: number = 6;
  public temp_medias: Array<any> = [];

  public loading: any;

  categories_checkbox_open: boolean;
  categories_checkbox_result;
  categories: Array<any> = [];

  constructor(
    public nav: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public params: NavParams,
    public BaseApp: BaseProvider,
    public profileService: ProfileService,
    public listingService: ListingService,
    public mediaService: MediaService
  ){

    this.step1Form = new FormGroup({
      category: new FormControl('', Validators.required),
      medias: new FormControl([])
    });

    this.loading = this.loadingCtrl.create();
  }

  ionViewWillEnter(){
    // Categories - Take it to the right place
    this.categories = this.listingService.getCategories();
    // Get the Listing Key Reference form the nav params
    this.listing_ref = this.params.get('key');
    // Enable the steps if editing 

    this.listingService.loadListingData(this.listing_ref).then((result) => {

      this.listing = result["listing"];
      if(!this.listing_ref){
        this.listing_ref = result["key"];
      }
      this.setStep1Form(this.listing);


      // setup the radio box when the form have been saved
      if(this.listing.form_control[0] === true){
        this.description_radio = "checkmark-circle-outline";
      }
      if(this.listing.form_control[1] === true){
        this.location_radio = "checkmark-circle-outline";
      }
      if(this.listing.form_control[2] === true){
        this.price_radio = "checkmark-circle-outline";
      }
      if(this.listing.form_control[3] === true){
        this.schedule_radio = "checkmark-circle-outline";
      }
      if(this.listing.form_control[4] === true){
        this.details_radio = "checkmark-circle-outline";
      }


    });
  }


  setStep1Form(data) {
    this.temp_medias = data.medias;
    this.step1Form.setValue({
      category: data.category,
      medias: data.medias
    });
  }

  // Process the step 1
  saveListing(){
    // if(step == "1"){
    //   this.step1Form.patchValue({medias: this.temp_medias});
    //   var data = this.step1Form.value;
    // }else if(step == "2"){
    //   var data = this.step2Form.value;
    // }

    if(this.step1Form.valid){

      this.step1Form.patchValue({medias: this.temp_medias});
      var data = this.step1Form.value;

      if(this.listing_ref){
        this.listingService.updateListing(this.listing_ref, data)
        .catch((error) => {
          console.log(error);
          let title = "Ops! Sorry about that";
          this.BaseApp.showAlert(title, error.message);
        });
      }

    }
  }

  // Move this to listing.service!!!
  uploadPicture(media){

    // this.loading.present();
     // Get the media local path
    let media_path = media.media_path;
    // Read the media to Blob file
    let blobFilePromise = this.mediaService.createBlobFile(media_path);
    // Upload the Blob file to the storate server
    let uploadTask = blobFilePromise.then((blobFile) =>{
      return this.listingService.uploadPicutre(blobFile, this.listing_ref);
    }).catch((error) => {
      console.log(error.message);
    });

    Promise.all([blobFilePromise, uploadTask]).then((results) => {

      media.media_path = results[1];
      this.temp_medias.unshift(media);
      this.temp_medias.pop();
      this.temp_medias[0].order = 0;
      this.temp_medias = this.reorderMedias(this.temp_medias);
      this.max_media = this.max_media - 1;

      media = {medias: this.temp_medias};
      return this.listingService.updateListing(this.listing_ref, media).then(() => {
        // this.loading.dismiss();
      }).catch((error) => {
        console.log(error.message);
      });

    }).catch((error) => {
      console.log(error.message);
      let title = "Ops! Sorry about that";
      this.BaseApp.showAlert(title, error.message);
    });
  }

  doGetPicture(source){ 
    this.mediaService.getListingPicture(source).then((imageURI) => {
      if(imageURI) {
        let media = {media_path: imageURI};
        this.uploadPicture(media);
      }
    });
  }

  cameraActionSheet(){
    if(this.max_media > 1){
      let actionSheet = this.actionSheetCtrl.create({
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Take Picture',
            icon: 'camera',
            handler: () => {
              this.doGetPicture("CAMERA");
            }
          },
          {
            text: 'Choose from Library',
            icon: 'images',
            handler: () => {
              this.doGetPicture("LIBRARY");
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              actionSheet.dismiss();
            }
          },

        ]
      });
      actionSheet.present();
    }else{
      let title = "limit reached";
      let message = "Sorry! You reach your limit of 6 pictures";
      this.BaseApp.showAlert(title, message);
    }
  }

  /**
  * Handle the Images Modal
  */
  presentImagesModal() {
    let imagesModal = this.modalCtrl.create(ListingImagesPage, { medias: this.temp_medias });
    imagesModal.onDidDismiss(data => {
      this.temp_medias = data;

      let media = {medias: this.temp_medias};
      return this.listingService.updateListing(this.listing_ref, media);
    });
    imagesModal.present();
  }

  /**
  * Handle the Description Modal with the checkbox controle
  */
  presentDescriptionModal() {
    let descModal = this.modalCtrl.create(ListingFormDescPage, { data: this.listing });
    descModal.onDidDismiss(data => {
      let desc_data = data;
      if(desc_data.form_control[0] === true){
        this.description_radio = "checkmark-circle-outline";
      }else{
        this.description_radio = "radio-button-off";
      }
      return this.listingService.updateListing(this.listing_ref, desc_data);
    });
    descModal.present();
  }

  /**
  * Handle the Location Modal with the checkbox controle
  */
  presentLocationModal() {
    let locationModal = this.modalCtrl.create(LocationModalPage, { data: this.listing });
    locationModal.onDidDismiss(data => {
      if(data.location.geolocation){ 

        if(data.form_control[1] === true){
          this.location_radio = "checkmark-circle-outline";
        }else{
          this.location_radio = "radio-button-off";
        }

        this.listingService.updateListing(this.listing_ref, data);
      }
    });
    locationModal.present();
  }

  /**
  * Handle the Price Modal with the checkbox controle
  */
  presentPriceModal() {
    let priceModal = this.modalCtrl.create(ListingFormPricePage, { data: this.listing });
    priceModal.onDidDismiss(data => {

      console.log('PRICEEEEEEEEEE',data);

      if(data.form_control[2] === true){
        this.price_radio = "checkmark-circle-outline";
      }else{
        this.price_radio = "radio-button-off";
      }
      return this.listingService.updateListing(this.listing_ref, data);
    });
    priceModal.present();
  }

  /**
  * Handle the Schedule Modal with the checkbox controle
  */
  presentScheduleModal() {
    let scheduleModal = this.modalCtrl.create(ListingFormSchedulePage, { data: this.listing });
    scheduleModal.onDidDismiss(data => {

      if(data.form_control[3] === true){
        this.schedule_radio = "checkmark-circle-outline";
      }else{
        this.schedule_radio = "radio-button-off";
      }
      return this.listingService.updateListing(this.listing_ref, data);
    });
    scheduleModal.present();
  }

  /**
  * Handle the Details Modal with the checkbox controle
  */
  presentDetailsModal() {
    let detailsModal = this.modalCtrl.create(ListingFormDetailsPage, { data: this.listing });
    detailsModal.onDidDismiss(data => {
      let details_data = data;
      if(details_data.form_control[4] === true){
        this.details_radio = "checkmark-circle-outline";
      }else{
        this.details_radio = "radio-button-off";
      }
      return this.listingService.updateListing(this.listing_ref, details_data);
    });
    detailsModal.present();
  }


  reorderMedias(medias){
    let len = medias.length;
    while(len--){
      medias[len].order = len;
    }
    return medias;
  }

  closeForm(){
    this.nav.setRoot(ListingPage);
  }


}
