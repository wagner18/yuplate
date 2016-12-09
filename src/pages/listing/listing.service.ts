import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';

// import { AppService } from '../../app/app.service';
// import { ListingItemModel } from './listing.model';

@Injectable()
export class ListingService {

  // service: AppService = new AppService();
  path_api: string;

  constructor() {
    this.path_api = "dishes";
  }

  getItems(){
    // return this.service.index(this.path_api);
  }


}
