import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ListingPage } from '../listing/listing';

// import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseProvider } from '../../app/base.provider';
import { ListingService } from '../../providers/listing.service';
import { MediaService } from '../../providers/media.service';

import { ListItemService } from '../../providers/list-item.service';

import { ListingModel } from '../../models/listing-model';
import { FormControlModel } from '../../models/listing-model';
import { MediaModel } from '../../models/listing-model';

/* Pages */
import { ListingFormCategoriesPage } from '../listing-form-categories/listing-form-categories';
import { ListingFormDescPage } from '../listing-form-desc/listing-form-desc';
import { ListingFormPricePage } from '../listing-form-price/listing-form-price';
import { ListingFormSchedulePage } from '../listing-form-schedule/listing-form-schedule';
import { ListingFormDetailsPage } from '../listing-form-details/listing-form-details';
import { LocationModalPage, } from '../location-modal/location-modal';
import { ListingImagesPage } from '../listing-images/listing-images';

@Component({
  selector: 'listing-form-page',
  templateUrl: 'listing-form.html',
  providers: [ListingService]
})
export class ListingFormPage {

  public listing: any;
  public typeForm: FormGroup;
  public new_listing: boolean = true;
  public categories: Array<any> = [];

  public steps_validation: number = 0;
  public publish_disabled: boolean = true;
  public formControlRadio: any = {
    categories: "radio-button-off",
    description:"radio-button-off",
    description_label: "Set a title and summary",
    location: "radio-button-off",
    price: "radio-button-off",
    schedule: "radio-button-off",
    details: "radio-button-off"
  }

  public listing_ref: string = null;
  public max_media: number = 6;
  public temp_medias: Array<any> = [];
  public loading: any;

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
    public mediaService: MediaService,
    public itemService: ListItemService
  ){

    this.typeForm = new FormGroup({
      listing_type: new FormControl('', Validators.required)
    });

    this.loading = this.loadingCtrl.create();
  }

  ionViewWillEnter(){

    // Get the Listing Key Reference form the nav params
    this.listing_ref = this.params.get('key');

    // Categories - Take it to the right place
    this.categories = this.listingService.getCategories();

    // test if the form is an new entry
    if(this.listing_ref !== undefined){
      this.new_listing = false;
      // Load the listing data from the database and set into the view
      this.loadListingData();
    }

  }

  /**
  * Save the listing type and show the next listing form
  */
  nextListingForm() {
    if(this.typeForm.valid){      
      this.listingService.loadListingData(null).then((result) => {

        console.log(result);
        if(result["listing"] !== null) { 

          this.listing_ref = result["key"];
          this.listing = result["listing"];

          this.listing.listing_type = this.typeForm.value.listing_type;
          this.temp_medias = this.listing.medias;

          this.listingService.updateListing(this.listing_ref, { listing_type: this.typeForm.value.listing_type})
          .then(()=>{
            this.new_listing = false;
          });


        }else{
          console.log("Listing is null - ", result);
        }
        
      })
      .catch(error => {
        console.log(error);
      });
      
    }
  }


  /**
  * Load the listing data
  */
  loadListingData() {

    this.listingService.loadListingData(this.listing_ref).then((result) => {

      this.listing = result["listing"];
      if(!this.listing_ref){
        this.listing_ref = result["key"];
      }
      this.listing['key'] = this.listing_ref;

      // Remove this code
      // if(this.listing.form_control == undefined){
      //   this.listing['form_control'] = new FormControlModel();
      // }
      // if(this.listing.published == undefined){
      //   this.listing['published'] = false;
      // }

      // Set the UI Form values on into the view
      this.temp_medias = this.listing.medias;

      // setup the radio boxies when the form have been saved
      if(this.listing.form_control !== undefined){
        Object.keys(this.listing.form_control).map(key => {
          if(this.listing.form_control[key] === true){
            this.formControlRadio[key] = "checkmark-circle-outline";
            this.steps_validation++;
          }
        });
      }

      this.checkPublishValidation();
    });

  }

  /**
  * Check if all the steps are true and enable the 
  * publishing toggle
  */
  checkPublishValidation(){
    if(this.listing.medias.length > 1 && this.steps_validation === 6){
      this.publish_disabled = false;
    }else{
      this.publish_disabled = true;
    }
  }

  /**
  * Save the listing data
  */ 
  saveListing(){
      if(this.temp_medias.length > 0){
        this.listing.medias = this.temp_medias;
      }

      if(this.listing_ref){
        this.listingService.updateListing(this.listing_ref, this.listing).catch((error) => {
          console.log(error);
          let title = "Ops! Sorry about that";
          this.BaseApp.showAlert(title, error.message);
        });
      }

      this.checkPublishValidation();
  }

  /**
  * Save each step of the form
  */
  saveStep(){
    if(this.listing !== undefined && this.listing_ref){

      let check = 6;
      Object.keys(this.listing.form_control).map( ctrl_key => {
        if(this.listing.form_control[ctrl_key] === true){
          if(this.steps_validation < check){
            this.steps_validation++;
          }
        }else{
          if(this.steps_validation > 0){
            this.steps_validation--;
            check--;
          }
        }
      });

      this.checkPublishValidation();

      this.listingService.updateListing(this.listing_ref, this.listing).catch((error) => {
        console.log(error);
        let title = "Ops! Sorry about that";
        this.BaseApp.showAlert(title, error.message);
      });

    }
  }

  /**
  * Set the listing draft as an item to be published
  */
  publishListing(){
    this.loading.present();
    if(this.listing.medias.length > 1 && this.steps_validation === 6){
      this.itemService.publishItem(this.listing).then(result => {

        this.listing['published'] = true;
        this.saveStep();

        this.loading.dismiss();

      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  /**
  * Upload the picture to the database - Move this to listing.service!!!
  * @param media = media object with the picture path
  */
  uploadPicture(media){

    // this.loading.present();
    // Get the media local path
    let media_path = media.media_path;
    // Read the media to Blob file
    let blobFilePromise = this.mediaService.createBlobFile(media_path);
    // Upload the Blob file to the storate server
    let uploadTask = blobFilePromise.then((blobFile) =>{
      return this.listingService.uploadPicture(blobFile, this.listing_ref);
    }).catch((error) => {
      console.log(error.message);
    });

    Promise.all([blobFilePromise, uploadTask]).then((results) => {

      media.media_path = results[1]; // Index 1 contein a firebase URI to download the image
      this.temp_medias.unshift(media);
      this.temp_medias.pop();
      this.temp_medias[0].order = 0;
      this.temp_medias = this.reorderMedias(this.temp_medias);
      this.max_media = this.max_media - 1;

      media = {medias: this.temp_medias};
      // Update the listing media reference with the new picture URI
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
      

      // Set to save
      // this.saveStep(media);
    });
    imagesModal.present();
  }

  /**
  * Handle the Categories Modal with the checkbox controle
  */
  presentCategoriesModal() {
    let catModal = this.modalCtrl.create(ListingFormCategoriesPage, { data: this.listing });
    catModal.onDidDismiss(data => {
      if(data !== undefined) {
        if(data.form_control.categories === true){
          this.formControlRadio.categories = "checkmark-circle-outline";
        }else{
          this.formControlRadio.categories = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    catModal.present();
  }


  /**
  * Handle the Description Modal with the checkbox controle
  */
  presentDescriptionModal() {
    let descModal = this.modalCtrl.create(ListingFormDescPage, { data: this.listing });
    descModal.onDidDismiss(data => {
      if(data.form_control.description === true){
        this.formControlRadio.description = "checkmark-circle-outline";
      }else{
        this.formControlRadio.description = "radio-button-off";
      }
      this.listing = data;
      this.saveStep();
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

        if(data.form_control.location === true){
          this.formControlRadio.location = "checkmark-circle-outline";
        }else{
          this.formControlRadio.location = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
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

      if(data.form_control.price === true){
        this.formControlRadio.price = "checkmark-circle-outline";
      }else{
        this.formControlRadio.price = "radio-button-off";
      }
      this.listing = data;
      this.saveStep();
    });
    priceModal.present();
  }

  /**
  * Handle the Schedule Modal with the checkbox controle
  */
  presentScheduleModal() {
    let scheduleModal = this.modalCtrl.create(ListingFormSchedulePage, { data: this.listing });
    scheduleModal.onDidDismiss(data => {

      if(data.form_control.schedule === true){
        this.formControlRadio.schedule = "checkmark-circle-outline";
      }else{
        this.formControlRadio.schedule = "radio-button-off";
      }
      this.listing = data;
      this.saveStep();
    });
    scheduleModal.present();
  }

  /**
  * Handle the Details Modal with the checkbox controle
  */
  presentDetailsModal() {
    let detailsModal = this.modalCtrl.create(ListingFormDetailsPage, { data: this.listing });
    detailsModal.onDidDismiss(data => {
      if(data.form_control.details === true){
        this.formControlRadio.details = "checkmark-circle-outline";
      }else{
        this.formControlRadio.details = "radio-button-off";
      }
      this.listing = data;
      this.saveStep();
    });
    detailsModal.present();
  }

  /**
  *
  */
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
