import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { DataService } from './data.service';

import { ItemModel } from '../models/listing-model';
import { MediaModel } from '../models/listing-model';
import { PriceModel } from '../models/listing-model';
import { ScheduleModel } from '../models/listing-model';
import { LocationModel } from '../models/listing-model';


@Injectable()
export class ListingService {

	private LISTING_REF: string = "listing/";
	private user_profile: any;
	public listing: ItemModel;
	public max_media: number = 6;
	public result: { key: string; listing: any; };

  constructor(
    private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ){  }


  getListing(key){
  	return this._dataService.database.child(this.LISTING_REF + key);
  }


  listListing(query){
  	return this._dataService.database.child(this.LISTING_REF);//.limitToLast(5);
  }

  saveListing(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.uid = currentUser.uid;
      return this._dataService.database.child(this.LISTING_REF).push(data);
    });
  }

  updateListing(key, data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.uid = currentUser.uid;
      return this._dataService.database.child(this.LISTING_REF + key).update(data);
    });
  }


  /**
  * Load the listing from the database if there is a Key, if not, create
  * a craft one based on the Listing Model.
  */
  loadListingData(key){

  	return new Promise((resolve, reject) => {
	    this.profileService.getProfile().then((promises) => {

	    	let profilePromise = promises[1];
	      profilePromise.on('value', profileSnap => {
	        if(profileSnap.val()){
            var profile = profileSnap.val();

	          // If listing has an key, fetch the data
	          if(key){
	            this.getListing(key).once('value', (listingSnap) => {
	            	this.result = { key: listingSnap.key, listing: listingSnap.val() };
	             	resolve(this.result);
	            })
	            .catch((error) => {
	            	reject(error);
	            });
	          }else{

	          	let medias = [];
	          	let i = this.max_media;
	            while(i--) {
	              medias.push({media_path: './assets/images/default-placeholder.png'});
	            }

	            // Create a craft to the listing
	            var data = new ItemModel();
	            data.medias = medias;
              data.price = new PriceModel();
                data.price.currency = profile.currency;

	            this.saveListing(data).then((ref) => {
	            	this.result = { key: ref.key, listing: data};
	              resolve(this.result);
	            })
	            .catch((error) => {
	            	reject(error);
	            });
	          }

	        }
	      });

	    });

	  });
  }


  /**
  * Return a promise with the resolved upload task snapshot or reject
  */
  uploadPicutre(imageBlob, ref){
    let imageRef = this.LISTING_REF + ref + "/listing_" + Date.now() + ".jpg";;
    return new Promise((resolve, reject) => {

      let upTask = this._dataService.imageRef().child( imageRef ).put(imageBlob);
      upTask.on('state_changed', function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      function(error) {
        reject(error);
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        resolve(upTask.snapshot.downloadURL);
      });
    });
  }


  // Categories - Take it to the right place
  getCategories(){
    let categories = [
      {type: 'select', label: 'Beef', value: 'Beef'},
      {type: 'select', label: 'Steak', value: 'Steak'},
      {type: 'select', label: 'Chicken', value: 'Chicken'},
      {type: 'select', label: 'Fish', value: 'Fish'},
      {type: 'select', label: 'Seafood', value: 'Seafood'},
      {type: 'select', label: 'Pasta', value: 'Pasta'},
      {type: 'select', label: 'Salads', value: 'Salads'},
      {type: 'select', label: 'Appetizes', value: 'Appetizes'},
      {type: 'select', label: 'Desserts', value: 'Desserts'}
    ];

    return categories;
  }


    // Categories - Take it to the right place
  getWeedDays(){
    let weekDays = [
      {type: 'select', label: 'Sunday', value: 'Sunday'},
      {type: 'select', label: 'Monday', value: 'Monday'},
      {type: 'select', label: 'Tuesday', value: 'Tuesday'},
      {type: 'select', label: 'Wednesday', value: 'Wednesday'},
      {type: 'select', label: 'Thursday', value: 'Thursday'},
      {type: 'select', label: 'Friday', value: 'Friday'},
      {type: 'select', label: 'Saturday', value: 'Saturday'}
    ];

    return weekDays;
  }


}
