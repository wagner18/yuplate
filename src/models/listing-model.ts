
export class ListingModel{
  published: boolean = false;
  title: string = "";
  summary: string = "";
  description: string = "";
  privacity: string = "public";

  // delivery & carryout data
  carryout: boolean = true;
  delivery: boolean = false;
  delivery_fee: number = 0.00;
  delivery_policies: string = "";
  delivery_processing_time: string = "";

  // Shipping data
  shipping: boolean = false;
  shipping_fee: number = 0.00;
  shipping_processing_time: string = "";
  refund_policies: string = "";
  cancellation_policies: string = "";
  additional_policies: string = "";

  measure_unit: string = "";
  unit_value: number = 1;
  confirmation: boolean = false;
  listing_type: string;


  location: LocationModel = {
      address: "",
      geolocation: { lat: 38.046386, lng: -87.551769 }
    }

  categories: Array<any> = [];
  price: PriceModel;
  schedule: Array<ScheduleModel> = [];
  medias: Array<any> = [];

  created_at: number = Date.now();
  update_at: number = Date.now();
  form_control: FormControlModel = new FormControlModel();

}

export class ListingTypeModel {
  service: boolean; // Recipes listed as a chef service to preper this recipe.
  dish: boolean; // A dish from a local restaurant or licensed chef.
  pantry: boolean; // to specific craft products such spices. tometoes cans, crafts pesto and so on.
  bakery: boolean; // bakery products such as brads, cakes and so on.
  farm_fresh: boolean; // a service to allow local farms set up an fresh engridients chain in box to delivery or pickup
  event: boolean // A event as dinner, fairs and so on.
}

export class FormControlModel {
  categories: boolean =  false;
  description: boolean = false;
  location: boolean = false;
  price: boolean = false;
  details: boolean = false;
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
