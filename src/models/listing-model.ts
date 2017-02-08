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
  delivery_fee: number = 0.00;
  measure_unit: string = "";
  unit_value: number = 1;
  confirmation: boolean = false;
  listing_type: string;
  status: string = "craft";
  total_favorites: number = 0;
  total_reviews: number =  0;
  total_rate: number = 1;

  location: LocationModel = {
      address: "",
      geolocation: { lat: 38.046386, lng: -87.551769 }
    }

  price: PriceModel;
  schedule: Array<ScheduleModel> = [];
  medias: Array<any> = [];
  reviews: Array<ReviewModel> = [];

  created_at: number = Date.now();
  update_at: number = Date.now();
  form_control: Array<boolean> = [false, false, false,false, false];

}

export class ListingType {
  service: boolean; // Recipes listed as a chef service to preper this recipe.
  dish: boolean; // A dish form a local restaurant or licecid chef.
  event: boolean // A event as dinner, fears and so on.
  crafted_food: boolean; // to specific craft products such farm cheese, tometoes cans, condiments, crafts bread and so on.
  farm_fresh: boolean; // a service to allow local farms set up an fresh engridients chain in box to delivery or pickup
}

export class LocationModel{
  address: string = "";
  geolocation: any = {};
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
  long_term_price: number = 0.00;
  currency: string = "USD";
}

export class ScheduleModel{
  day: string = "";
  day_number: number;
  from_time: string = "";
  to_time: string = "";
  status: boolean = true;
  promo_price: boolean = false;
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

export class ListingOrderModel {
  listing_uid: string = "";
  customer_uid: string = "";
  quantity: number;
  total_price: number;
  confimed: boolean = true;
  schedule: any;
  payment: any;
  messages: any;
  created_at: number;
}

