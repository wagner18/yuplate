import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
	Inject the map library and provide it through the application
*/
@Injectable()
export class MapProvider {

  constructor() {
  }

  /**
  *	
  */
  setMap(): Promise<any>{
  	let promise = new Promise(function(resolve, reject) {

  		let url = "http://maps.google.com/maps/api/js?libraries=places";

  		// Create a <script> tag and set the Lib URL as the source.
      let script = document.createElement('script');
      script.src = url;
      document.getElementsByTagName('html')[0].appendChild(script);

      script.addEventListener('load', ($event) => {
        resolve($event);
      }, false);

      script.addEventListener('error', () => {
        reject(script);
        console.log('was rej');
      }, false);

      // document.html.appendChild(script);
    });

    return promise;
  }


}
