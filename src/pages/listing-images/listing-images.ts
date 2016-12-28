import { Component, Input } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-listing-images',
  templateUrl: 'listing-images.html'
})
export class ListingImagesPage {

	@Input() reorder: boolean = this.orderState;

	public medias: Array<any> = [];
	public orderState: boolean = false;
	public orderActionLabel: string = "Reorder";

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController, 
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
    console.log(this.medias);
  }

	dismiss() {
		let data = this.medias;
		this.viewCtrl.dismiss(data);
	}

	doGetPicture(){
		console.log('take pictures');
	}

	showPicture(){
		
	}

}
