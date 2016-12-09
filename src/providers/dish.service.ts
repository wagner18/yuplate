import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';

import { DataService } from './data.service';


@Injectable()
export class DishService {

	private DISHES_REF: string = "dishes/";
	public dishes: any;

  constructor(private _data: DataService, private _authService: AuthService) {}


  listDish(query){
  	return this._data.database.child(this.DISHES_REF);
  }

}
