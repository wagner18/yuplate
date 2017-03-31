export class ItemModel {
  active: boolean = true;
  title: string = "";
  summary: string = "";
  description: string = "";
  privacity: string = "public";
  carryout: boolean = true;
  delivery: boolean = false;
  delivery_fee: number = 0.00;
  shipping: boolean = false;
  shipping_fee: number = 0.00;
  processing_time: string = "";
  measure_unit: string = "";
  unit_value: number = 1;
  confirmation: boolean = false;
  listing_type: string;

  main_price: number = 14.00;
  promotion_price: number = 0.00;
  currency: string = "USD";

  schedule: Array<any> = [];

  total_favorites: number = 0;
  total_reviews: number =  0;
  total_rate: number = 4.5;

  location: any = {};
  medias: Array<any> = [];
  reviews: Array<ReviewModel> = [];

  seller_uid: string = "";
}


export class SimpleItemModel {
  title: string = "";
  description: string = "";
  privacity: string = "public";
  media: string = "";
  total_favorites: number = 0;
  total_reviews: number =  0;
}


export class RecentItemsModel {
  items: Array<SimpleItemModel>;
  populars: Array<SimpleItemModel>;
  categories: Array<SimpleItemModel>;
  banner_title: string;
  banner_image: string;
}

export class ReviewModel {
  comment: string = "";
  user_uid: string = "";
  user_name: string = "";
  user_image: string = "";
  item_uid: string = "";
  evaluation: Array<any> = [];
  media: Array<any> = [];
  active: boolean = true;
  created_at: number = Date.now();
  updated_at: number = Date.now();
}