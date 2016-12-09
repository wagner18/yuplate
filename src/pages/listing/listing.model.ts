export class ListingModel {
  items: Array<ListingItemModel>;
  populars: Array<SimpleItemModel>;
  categories: Array<SimpleItemModel>;
  banner_title: string;
  banner_image: string;
}

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
  title: string;
  image: string;
}
