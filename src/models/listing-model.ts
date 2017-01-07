export class ListingItemModel {
  title: string;
  image: string;
  description: string;
  category: any;
  likes: number = 0;
  comments: number = 0;
  liked: boolean = false;
}

export class SimpleItemModel {
  title: string = "";
  description: string = "";
  privacity: string = "public";
  media: string = "";
  total_favorites: number = 0;
  total_reviews: number =  0;
  review: number = 4;
}

export class ListingModel {
  items: Array<SimpleItemModel>;
  populars: Array<SimpleItemModel>;
  categories: Array<SimpleItemModel>;
  banner_title: string;
  banner_image: string;
}


export class ItemModel{
  title: string = "";
  summary: string = "";
  description: string = "";
  category: string = "";
  privacity: string = "public";
  carryout: boolean = true;
  delivery: boolean = false;
  servings: number = 1;
  status: string = "craft";
  total_favorites: number = 0;
  total_reviews: number =  0;
  review: number = 4;

  location: LocationModel = {
      address: "",
      geolocation: {}
    }

  price: PriceModel;
  medias: Array<any> = [];
  reviews: Array<ReviewModel> = [];

  created_at: number = Date.now();
  update_at: number = Date.now();

}

export class LocationModel{
  address: string = "";
  geolocation: {}
}


export class MediaModel{
  media_name: string =  "";
  media_path: string = "";
  media_type: string = "image/jpg";
  // created_at: number = Date.now();
  // updated_at: number = Date.now();
}

export class PriceModel{
  main_price: number = 18.46;
  percentage_discount: number = 0.78;
  discount_price: number = 0.0;
  delivery_fee: number = 0.0;
  currency: string = "USD";
}
  
export class ReviewModel {
  comment: string = "";
  user_uid: string = "";
  item_uid: string = "";
  evaluation: Array<any> = [];
  media: Array<any> = [];
  active: boolean = true;
  created_at: number = Date.now();
  updated_at: number = Date.now();
}

