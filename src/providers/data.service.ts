/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Provide a single place to connect with the data structure on the application (Firebase 3)
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 12/06/2016
*/

import { Injectable, OnInit } from '@angular/core';
import firebase from 'firebase';
import GeoFire from 'geofire/dist/geofire';


// const FirebaseAuthConfig = {
//   provider: AuthProviders.Google,
//   method: AuthMethods.Redirect
// }


@Injectable()
export class DataService {

	private ROOT_NODE: string = "/";
	public database: any; 
  public geoFire: any;

	public auth: any;
  public storage: any;
  public storageRef: any;
  

  constructor() {
  	this.initializeApp();
  }

  private initializeApp(){

  	  firebase.initializeApp({
	      apiKey: "AIzaSyBtsVlPeG_pNRcoUM0lnAn95Jy0k1rdfK8",
	      authDomain: "grouplate-acd28.firebaseapp.com",
	      databaseURL: "https://grouplate-acd28.firebaseio.com",
	      storageBucket: "grouplate-acd28.appspot.com",
	      messagingSenderId: "733360059699"
  		});

      // Set the Firebase reference to the root node
  	  this.database = firebase.database().ref(this.ROOT_NODE);
      // GeoFire reference
      this.geoFire = new GeoFire(firebase.database().ref(this.ROOT_NODE + "listings_geofire/"));

	  	// as well as adding a reference to the Firebase
      // authentication method
      this.auth = firebase.auth();
      // Just provide the storage object
      this.storage = firebase.storage();
      // Define a default storage reference
      this.storageRef = firebase.storage().ref(this.ROOT_NODE);

  }

  /**
  *
  */
  setGeolocation(geoData){
    this.geoFire.set(geoData.key, geoData.location)
    .catch(error => {
      console.log(error);
    });
  }

  /**
  *
  */
  


  /**
  *
  */
  public imageRef() {
    let imageRef = firebase.storage().ref("images/");
    return imageRef;
  }


}
