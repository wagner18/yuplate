export class DishItemModel {
  title: string;
  image: string;
  description: string;
  category: any;
  likes: number = 0;
  comments: number = 0;
  liked: boolean = false;
  populars: Array<any>;
}
