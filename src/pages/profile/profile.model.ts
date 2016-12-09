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

export class ProfileModel {
  user: UserModel = new UserModel();
  following: Array<UserModel> = [];
  followers: Array<UserModel> = [];
  posts: Array<ProfilePostModel> = [];
}
