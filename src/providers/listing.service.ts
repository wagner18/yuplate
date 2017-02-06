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
	private profile: any;

	public listing: ItemModel;
	public max_media: number = 6;
	public result: { key: string; listing: any; };

  constructor(
    private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ){

  }

  /**
  *
  */
  getListing(key){
  	return this._dataService.database.child(this.LISTING_REF + key);
  }

  /**
  *
  */
  listListing(query){
  	return this._dataService.database.child(this.LISTING_REF);//.limitToLast(5);
  }

  /**
  *
  */
  saveListing(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      data.uid = currentUser.uid;
      return this._dataService.database.child(this.LISTING_REF).push(data);
    });
  }

  /**
  *
  */
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
	    this.profileService.getLocalProfile().then((profile) => {
        if(profile !== undefined){

          this.profile = profile;

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
              data.price.currency = this.profile.currency;

              console.log("Currencyyyyyyyyyy",data);

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
  }

  /**
  * Summarize a full listing object to be persisted as embeded object
  * @param listing - the regular listing object with full propertires
  */
  summarizeListing(listing) {
    // NOT THE BEST WAY TO CLONE AN OBJECT, BUT WORKS FOR NOW, I HAVE NO TIME FOR BENCHMARK IT
    let clone_listing = JSON.parse(JSON.stringify(listing)); //Clone the listing object
    clone_listing.form_control = null;
    clone_listing.reviews = null;
    clone_listing.schedule = null;

    return clone_listing;
  }


  /**
  * Return a promise with the resolved upload task snapshot or reject
  * @param imageBlob - The binary image file to be uploaded to the server
  * @param ref - the listing reference to map the file within the firebase storage
  */
  uploadPicture(imageBlob, ref){
    let imageRef = this.LISTING_REF + ref + "/listing_" + Date.now() + ".jpg";
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
      {type: 'select', label: 'Sunday', value: 0},
      {type: 'select', label: 'Monday', value: 1},
      {type: 'select', label: 'Tuesday', value: 2},
      {type: 'select', label: 'Wednesday', value: 3},
      {type: 'select', label: 'Thursday', value: 4},
      {type: 'select', label: 'Friday', value: 5},
      {type: 'select', label: 'Saturday', value: 6}
    ];
    return weekDays;
  }

  /**
  * Return a list of dates that machs the giben weekdays within 30 days
  * @param {day, time_range} - availableDays - list of Objects with week days available to the specific listing
  */
  getAvailableDays(availableDays){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    let days = [];

    for(let i = 0; i < 30; i++){
      let day = new Date(year, month, date + i);
      availableDays.find(function(weekday) {
        if(day.getDay() == weekday.day){
          days.push(day);
        }
      });
    }
    return days;
  }


}
