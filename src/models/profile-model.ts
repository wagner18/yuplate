export class ProfileModel {
  uid: string = "";
  firstName: string  = "";
  lastName: string  = "";
  gender: string = "" ;
  birthday: string = "";
  about: string  = "";
  image: string  = "./assets/images/profile/default-avatar.png";
  email: string  = "";
  phone: string  = "";
  location: string  = "";
  shortProfile: ShortProfileModel;
  languages: Array<any> = [];
  verifiedInfo: Array<any> = [];
  currency: Array<any> = [];
  balanceAccount: string;
  favorites: Array<any> = [];
  reviews: Array<any> = [];
  messages: Array<any> = [];
  bookings: Array<any> = [];
  orderings: Array<any> = [];
  listings: Array<any> = [];
  created_at: number = Date.now();
}

export class ShortProfileModel{
  fullName: string = "";
  image: string = "./assets/images/profile/default-avatar.png";
  location: string= "";
  email: string = "";
}


export class UserModel {
  uid: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  about: string;
}

export class ProfilePostModel {
  date: Date;
	image: string;
	description: string;
	likes: number = 0;
	comments: number = 0;
	liked: boolean = false;
}

export class UserProfileModel {
  user: ProfileModel = new ProfileModel();
  following: Array<ProfileModel> = [];
  followers: Array<ProfileModel> = [];
  posts: Array<ProfilePostModel> = [];
}
