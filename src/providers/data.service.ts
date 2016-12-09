/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Provide a single place to connect with the data structure on the application (Firebase 3)
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 12/06/2016
*/

import { Injectable } from '@angular/core';
import firebase from 'firebase';

// const FirebaseAuthConfig = {
//   provider: AuthProviders.Google,
//   method: AuthMethods.Redirect
// }


@Injectable()
export class DataService {

	private ROOT_NODE: string = "/";
	public database: any; 
	public auth: any;

  constructor() {}

  public initializeApp(){

  	  firebase.initializeApp({
	      apiKey: "AIzaSyBtsVlPeG_pNRcoUM0lnAn95Jy0k1rdfK8",
	      authDomain: "grouplate-acd28.firebaseapp.com",
	      databaseURL: "https://grouplate-acd28.firebaseio.com",
	      storageBucket: "grouplate-acd28.appspot.com",
	      messagingSenderId: "733360059699"
  		});

  	  // this.auth = firebase.auth();
  	  this.database = firebase.database().ref(this.ROOT_NODE);
  }


}
