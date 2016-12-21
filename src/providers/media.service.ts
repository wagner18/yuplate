import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';

import { Camera, File } from 'ionic-native';
declare var cordova: any;
declare var window;

@Injectable()
export class MediaService {

	public loading: any;
  constructor(public platform: Platform, public loadingCtrl: LoadingController) {
    console.log('Hello MediaService Provider');

    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
  }

  /**
  * Get pictures for the profile
  */
  public getProfilePicture(source){

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

    let options = {
      quality: 25,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourcePicture,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 375,
      targetHeight: 375,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: Camera.Direction.FRONT
    }

    return this.getPicture(options);
  }

  /**
  * Get pictures for the listing
  */
  public getListingPicture(source){

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

    let options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourcePicture,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 375,
      targetHeight: 300,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: Camera.Direction.BACK
    }

    return this.getPicture(options);
  }


  private getPicture(options){

    // Get picture from camera or library
    return Camera.getPicture(options).then((imageURI) => {

      return imageURI;

    }, (error) => {
      console.log("Error taking picture: " + error);
      return null;
    });
  }

  createBase64File(filePath){

    return new Promise((resolve, reject) => {
     window.resolveLocalFileSystemURL(filePath,(fileEntry) => {
        
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function() {
                resolve(this.result);
            };

            reader.readAsDataURL(file);

        }, function (error) {
          console.log(error.message);
          reject(error);
        });

      });

    });


    // File.resolveLocalFilesystemUrl(imageURI).then((fileEntry) => {

    //   console.log(' File Entry object ===== ',fileEntry);

    //   let fileUrl = fileEntry.toURL();
    //   console.log(fileUrl);
    //   resolve(fileUrl);
    // });

  }

  createBlobFile(filePath): Promise<any>{

    return new Promise((resolve, reject) => {

      window.resolveLocalFileSystemURL(filePath, function (fileEntry) {
        fileEntry.file(function (file) {
           var reader = new FileReader();
           reader.onloadend = function () {
              // This blob object can be saved to firebase
              var blob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });                  
              resolve(blob);
           };
           reader.readAsArrayBuffer(file);
        });
      }, function (error) {
          console.log(error.message);
          reject(error);
      });

    });

  }


}
