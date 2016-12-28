import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { SegmentButton, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
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
import { ListingImagesPage } from '../listing-images/listing-images';

@Component({
  selector: 'listing-form-page',
  templateUrl: 'listing-form.html'
})
export class ListingFormPage {

  public listing: any;
  public step1Form: FormGroup;
  public step2Form: FormGroup;

  public event_form: FormGroup; // Change

  public step1: boolean = true;
  public step2: boolean = false;
  public step3: boolean = false;
  public step4: boolean = false;

  public section: string;
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

    this.section = "step1";

    this.step1Form = new FormGroup({
      category: new FormControl('', Validators.required),
      medias: new FormControl([])
    });

    this.step2Form = new FormGroup({
      title: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required)
    });

    this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl('2016-09-18', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
    });

    this.loading = this.loadingCtrl.create();
  }

  ionViewWillEnter(){
    this.loading.present();
    // Categories - Take it to the right place
    this.categories = this.listingService.getCategories();
    // Get the Listing Key Reference form the nav params
    this.listing_ref = this.params.get('key');
    // Enable the steps if editing 
    if(this.listing_ref){
      this.step2 = true;
      this.step3 = true;
    }

    this.listingService.loadListingData(this.listing_ref).then((result) => {

      this.listing = result["listing"];
      if(!this.listing_ref){
        this.listing_ref = result["key"];
      }

      this.setStep1Form(this.listing);
      this.setStep2Form(this.listing);

      this.loading.dismiss();
    });
  }


  setStep1Form(data) {
    this.temp_medias = data.medias;
    this.step1Form.setValue({
      category: data.category,
      medias: data.medias
    });
  }

  setStep2Form(data) {
    this.step2Form.setValue({
      title: data.title,
      summary: data.summary,
      location: data.location
    });
  }

  // Process the step 1
  saveListing(step){
    console.log(step, this.listing_ref);

    if(step == "1"){
      this.step1Form.patchValue({medias: this.temp_medias});
      var data = this.step1Form.value;
    }else if(step == "2"){
      var data = this.step2Form.value;
    }

    if(this.listing_ref){
      this.listingService.updateListing(this.listing_ref, data).then(() => {
        this.step2 = true;
        this.section = "step2";
      })
      .catch((error) => {
        console.log(error);
        let title = "Ops! Sorry about that";
        this.BaseApp.showAlert(title, error.message);
      });
    }
  }

  // Process the step 2
  saveStep2Form(){
    if(this.step2Form.valid){
      let data = this.step2Form.value;
      if(this.listing_ref){
        this.listingService.updateListing(this.listing_ref, data).then(() => {
          this.step3 = true;
          this.section = "step3";
        })
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

    this.loading.present();
     // Get the media local path
    let media_path = media.media_path;
    // Read the media to Blob file
    let blobFilePromise = this.mediaService.createBlobFile(media_path);
    // Upload the Blob file to the storate server
    let uploadTask = blobFilePromise.then((blobFile) =>{
      return this.listingService.uploadPicutre(blobFile, this.listing_ref);
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
        this.loading.dismiss();
      });

    }).catch((error) => {
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


  presentImagesModal() {
    let imagesModal = this.modalCtrl.create(ListingImagesPage, { medias: this.temp_medias });
    imagesModal.onDidDismiss(data => {
      this.temp_medias = data;

      let media = {medias: this.temp_medias};
      return this.listingService.updateListing(this.listing_ref, media);
    });
    imagesModal.present();
  }


  showPicture(picture){
    console.log(picture);
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


  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  createPost(){
    console.log(this.step1Form.value);
  }

  createEvent(){
    console.log(this.step2Form.value);
  }

  chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Categories');

    alert.addInput({
      type: 'checkbox',
      label: 'Steak',
      value: 'Steak'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Chicken',
      value: 'Chicken'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }

}
