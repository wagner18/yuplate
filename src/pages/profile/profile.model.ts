export class ProfileModel {
  uid: string = "";
  firstName: string  = "First name";
  lastName: string  = "Last name";
  about: string  = "";
  image: string  = "./assets/images/profile/default-avatar.png";
  email: string  = "";
  phone: string  = "";
  location: string  = "";
  favorites: Array<any> = [];
  messages: Array<any> = [];
  bookings: Array<any> = [];
  listings: Array<any> = [];
  reviews: Array<any> = [];

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
