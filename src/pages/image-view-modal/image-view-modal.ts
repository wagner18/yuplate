import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-image-view-modal',
  templateUrl: 'image-view-modal.html'
})
export class ImageViewModalPage {

	public medias: any;

  constructor(
  	public navCtrl: NavController,
  	public params: NavParams,
  	public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    this.medias = this.params.get('medias');
  }

  /**
  * Dismiss the Location Modal and retrive the data to the caller
  */
  dismiss() {
  	console.log("close it!!!!!");
    this.viewCtrl.dismiss();
	}

}
