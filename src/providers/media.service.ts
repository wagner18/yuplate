import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';

import { Camera, File } from 'ionic-native';
declare var cordova: any;

@Injectable()
export class MediaService {

	public loading: any;
  constructor(public platform: Platform, public loadingCtrl: LoadingController) {
    console.log('Hello MediaService Provider');

    console.log('My windows object',window);

    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
  }


  public getProfilePicture(source){

  	if(source == "LIBRARY"){
	  	if (this.platform.is('android')) {
	  		var sourcePicture = Camera.PictureSourceType.SAVEDPHOTOALBUM;
	  	}else{
	  		var sourcePicture = Camera.PictureSourceType.PHOTOLIBRARY;
	  	}
	  }else if(source == "CAMERA"){
			var sourcePicture = Camera.PictureSourceType.CAMERA;
	  }
 
  	// Get picture from camera or library
    return Camera.getPicture({
    	quality: 25,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: sourcePicture,
      encodingType: Camera.EncodingType.JPEG,
      targetHeight: 375,
      targetWidth: 375,
      correctOrientation: true,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: Camera.Direction.FRONT
    }).then((imageBase64) => {

  		return imageBase64;

		}, (error) => {
			console.log("Error taking picture " + error);
		});

  }



  public getPicture(source){

    if (this.platform.is('android')) {
      var platSourcePicture = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      var destType = Camera.DestinationType.FILE_URI;
    }else{
      var platSourcePicture = Camera.PictureSourceType.PHOTOLIBRARY;
      var destType = Camera.DestinationType.NATIVE_URI;
    }


    if(source == "LIBRARY"){
      var sourcePicture = platSourcePicture;
    }else if(source == "CAMERA"){
      var sourcePicture = Camera.PictureSourceType.CAMERA;
    }
 
    // Get picture from camera or library
    return Camera.getPicture({
      quality: 25,
      destinationType: destType,
      sourceType: sourcePicture,
      encodingType: Camera.EncodingType.JPEG,
      targetHeight: 375,
      targetWidth: 375,
      correctOrientation: true,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: Camera.Direction.FRONT
    }).then((ImageURL) => {

      console.log(ImageURL);

      // window.resolveLocalFileSystemURL(ImageURL, (file) => {

      //   console.log(file);

      // });

    }, (error) => {
      console.log("Error taking picture " + error);
    });

  }

}
