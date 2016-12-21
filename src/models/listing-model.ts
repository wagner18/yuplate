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
  description: string = "";
  privacity: string = "public";
  status: string = "creating";
  total_favorites: number = 0;
  total_reviews: number =  0;
  review: number = 4;

  location: LocationModel;

  price: PriceModel;
  medias: Array<MediaModel> = [];
  categories: Array<CategoryModel> = [];
  reviews: Array<ReviewModel> = [];

}

export class LocationModel{
  address: string = "";
  latitude: number =  -86.56850140610781;
  longitude: number = 38.46446660396708;
}

export class CategoryModel{
  category: string = "";
  active: boolean = true;
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

