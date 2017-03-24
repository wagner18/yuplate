import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class ProductService {

  constructor(public http: Http) {
    console.log('Hello ProductService Provider');
  }

  publishProduct(){
  	
  }

}
