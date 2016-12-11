import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Slides} from 'ionic-angular';

import { FeedPage } from '../feed/feed';
//import 'rxjs/Rx';

import { DishItemModel } from '../../app/models/dish.model';
import { DishService } from '../../providers/dish.service';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
  providers: [ DishService ]
})
export class ListingPage {

  public dishes: any;
  public listLimit: number = 10;
  slideOptions = {pager: true, loop: true};
  items: DishItemModel[];
  loading: any;

  constructor(
    public nav: NavController,
    public dishService: DishService,
    public loadingCtrl: LoadingController
  ){

    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });

  }

  ionViewDidLoad() {
    this.getItems();
  }

  private getItems(){

    let query = {
        limitToFirst:5,
        orderByKey: true
    };

    this.loading.present();
    this.dishService.listDish(query).limitToLast(this.listLimit).on('value', (snapshot) => {

      let objects = snapshot.val();
      this.dishes = Object.keys(objects).map(function (key) { return objects[key]; });

      console.log(this.dishes);
      this.loading.dismiss();
    });

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation', infiniteScroll);

    this.listLimit = this.listLimit + 10;
    //this.getItems();

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }


  goToFeed(category: any) {
    this.nav.push(FeedPage, {
      category: category
    });
  }

}
