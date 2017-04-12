import { Component, Input } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams, AlertController } from 'ionic-angular';

import { DataService } from '../../providers/data.service';

@Component({
  selector: 'page-listing-images',
  templateUrl: 'listing-images.html'
})
export class ListingImagesPage {

	public medias: Array<any> = [];
	public orderState: boolean = false;
	public orderActionLabel: string = "Reorder";

  @Input() reorder: boolean = this.orderState;

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public dataService: DataService,
  	public params: NavParams
  ) {}

  ionViewDidLoad() {
    this.medias = this.params.get('medias');
  }

  reorderList(){
  	if(this.orderState){
  		this.orderState = false;
  		this.orderActionLabel = "Reorder";
  	}else{
  		this.orderState = true;
  		this.orderActionLabel = "Done";
  	}
  }

  reorderItems(indexes) {
    let element = this.medias[indexes.from];
    this.medias.splice(indexes.from, 1);
    this.medias.splice(indexes.to, 0, element);
  }

	dismiss() {
		let data = this.medias;
		this.viewCtrl.dismiss(data);
	}

	doGetPicture(){
		console.log('take pictures');
	}

  /**
  * Delete a image from the storage and its reference from the database
  * @param index - Image position within the media array
  */
  deleteImage(index) {
    let image_url = this.medias[index].media_path;
    let image_ref = this.dataService.storage.refFromURL(image_url);
    let media_bkp = this.medias;
    this.medias.splice(index, 1);
    // Delete the item from the stoage and wipe it out of the database 
    image_ref.delete().then(() => {
      media_bkp = null;
    }).catch((error) => {
      console.log(error.message);
      this.medias = media_bkp;
    });
  }
  /**
  * Show a alert confirm before delete the image
  * @param index - Image position within the media array
  */ 
  confirmDeleteImage(index) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteImage(index);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel the action');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
  *
  */
	showPicture() {
		
	}

}
