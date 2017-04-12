/**
* Copyright 2016 Yuplate Inc. All Rights Reserved.
* Provide a single place with common helper with the util methos through the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 01/15/2017
*/

import { Injectable } from '@angular/core';


@Injectable()
export class HelperService {

	public timeConverter(UNIX_timestamp){

	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	  
	}

}