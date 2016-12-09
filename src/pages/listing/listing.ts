import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Slides} from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

import { DishItemModel } from '../../app/models/dish.model';
import { DishService } from '../../providers/dish.service';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
  providers: [ DishService ]
})
export class ListingPage {

  public dishes: any;
  slideOptions = {pager: true, loop: true};
  items: DishItemModel[];
  loading: any;

  constructor(
    public nav: NavController,
    public dishService: DishService,
    public loadingCtrl: LoadingController
  ){

    this.loading = this.loadingCtrl.create();

  }

  ionViewDidLoad() {
    this.getItems();
  }

  private getItems(): void{

    let query = {
        limitToFirst:5,
        orderByKey: true
    };

    this.loading.present();
    this.dishService.listDish(query).on('value', snapshot => {
      this.dishes = snapshot.val();
      this.loading.dismiss();
    });

  }


  goToFeed(category: any) {
    this.nav.push(FeedPage, {
      category: category
    });
  }

}
