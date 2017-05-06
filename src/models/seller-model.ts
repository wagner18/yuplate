export class SellerModel {
  comercial_name: string  = "";
  about: string  = "";
  image: string  = "./assets/images/profile/default-avatar.png";
  email: string  = "";
  phone: string  = "";
  location: any  = {};
  addresses: Array<BusinessAddressModel> = [];

  currency: Array<any> = [];
  favorites: Array<any> = [];
  reviews: Array<any> = [];

  seller_type: string = "Basic";
  license_number: string = "";
  verified_info: Array<any> = [];
  created_at: number = Date.now();
}


export class BusinessAddressModel {
  street_1: string = "";
  street_2: string = "";
  city: string = "";
  state: string = "";
  zip_code: string = "";
  phone: string = "";
  country: string = "";
  primary: boolean = false;
}


export class SellerType {
  type: Array<string> = [
    'Basic',
    'Restaurant',
    'Farmer',
    'Licensed chef'
  ]
}