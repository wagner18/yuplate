import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseProvider } from '../../app/base.provider';
import { MediaService } from '../../providers/media.service';

import { MediaModel } from '../../models/listing-model';

@Component({
  selector: 'listing-form-page',
  templateUrl: 'listing-form.html'
})
export class ListingFormPage {

  profile: any;
  section: string;

  step1_form: FormGroup;
  step2_form: FormGroup;
  event_form: FormGroup;
  media_number: number = 0;
  tempMedias: Array<any> = [
    {media_name: "image 1", media_type: "image/jpg", media_path: "../../assets/images/default-img-350x280.gif"},
    {media_name: "image 2", media_type: "image/jpg", media_path: "../../assets/images/default-img-350x280.gif"},
    {media_name: "image 3", media_type: "image/jpg", media_path: "../../assets/images/default-img-350x280.gif"},
    {media_name: "image 4", media_type: "image/jpg", media_path: "../../assets/images/default-img-350x280.gif"},
    {media_name: "image 5", media_type: "image/jpg", media_path: "../../assets/images/default-img-350x280.gif"}
  ]

  categories_checkbox_open: boolean;
  categories_checkbox_result;
  categories: Array<any> = [];

  constructor(
    public nav: NavController, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public BaseApp: BaseProvider,
    public profileService: ProfileService,
    public mediaService: MediaService,
    public actionSheetCtrl: ActionSheetController
  ){

    this.section = "step1";

    this.categories = [
      {type: 'select', label: 'Steak', value: 'Steak'},
      {type: 'select', label: 'Chicken', value: 'Chicken'},
      {type: 'select', label: 'Fish', value: 'Fish'},
      {type: 'select', label: 'Seafood', value: 'Seafood'},
      {type: 'select', label: 'Pasta', value: 'Pasta'},
      {type: 'select', label: 'Salads', value: 'Salads'},
      {type: 'select', label: 'Appetizes', value: 'Appetizes'},
      {type: 'select', label: 'Desserts', value: 'Desserts'}
    ];

    this.step1_form = new FormGroup({
      medias: new FormControl('', Validators.required),
      categories: new FormControl('', Validators.required)
    });

    this.step2_form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      medias: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      servings: new FormControl(2, counterRangeValidator(10, 1)),
      time: new FormControl('01:30', Validators.required),
      temperature: new FormControl(180)
    });


    this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl('2016-09-18', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
    });
  }

  ionViewWillEnter(){

    //this.loading.present();
    this.profileService.getProfile().then((promises) => {
      promises[1].on('value', snapshot => {
        
        if(snapshot.val()){
          this.profile = snapshot.val();
        }
        //this.loading.dismiss();
      });

    });
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  createPost(){
    console.log(this.step1_form.value);
  }

  createEvent(){
    console.log(this.step2_form.value);
  }

  doGetPicture(source){
    if(this.profile.uid){
      this.mediaService.getListingPicture(source).then((imageURI) => {
        if(imageURI) {

          let imageIndex = this.tempMedias.length;
          let media = {media_path: imageURI, order: imageIndex+1 };
          this.tempMedias.unshift(media);
        }
      });
    }
  }

  cameraActionSheet(){
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
  }


  showPicture(picture){
    console.log(picture);
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

    alert.addInput({
      type: 'checkbox',
      label: 'Fish',
      value: 'Fish'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Seafood',
      value: 'Seafood'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Pasta',
      value: 'Pasta'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Salads',
      value: 'Salads'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Appetizes',
      value: 'Appetizes'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Desserts',
      value: 'Desserts'
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
