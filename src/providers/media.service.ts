import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';

import {  } from 'ionic-native';

import { Camera, CameraPreview, CameraPreviewRect } from 'ionic-native';
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
  public getListingPicture(source) {

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
      quality: 85,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourcePicture,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false,
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
          console.log("BLOB FILE --- ", error.message);
          reject(error);
      });

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
  }


  previewCam(){
    // camera options (Size and location)
    let cameraRect: CameraPreviewRect = { x: 0,  y: 0, width: 375, height: 375 };
    // start camera
    CameraPreview.startCamera(
      cameraRect, // position and size of preview
      'back', // default camera
      true, // tap to take picture
      true, // disable drag
      false, // keep preview in front. Set to true (back of the screen) to apply overlaying elements
      1 // set the preview alpha
    );
  }

  takePicture(){
    // take a picture
    CameraPreview.takePicture({
      maxWidth: 640,
      maxHeight: 375
    });
  }

  cameraHandler(){
    // Set the handler to run every time we take a picture
    CameraPreview.setOnPictureTakenHandler().subscribe((result) => {
      console.log(result);
      // do something with the result
    });
  }

  showPreview(){
    CameraPreview.show();
  }

  hidePreview(){
    CameraPreview.hide();
  }

  switchCamera(){
    // Switch camera
    CameraPreview.switchCamera();
  }

  setColorEffect(){
     // set color effect to negative
    CameraPreview.setColorEffect('negative');
  }

  stopCamera(){
    // Stop the camera preview
    CameraPreview.stopCamera();
  }


}
