
export class OrderModel{
  listing_snapshot: any;

  delivery_option: string = "";
  delivery_address: any;

  quantity: number = 1;
  subtotal: number = 0.00;
  total_price: number = 0.00;
  delivery_schedule: number;

  confirmed: boolean = false;
  buyer_uid: string = "";
  seller_uid: string = "";

  buyer_note: string = "";

  order_options: Array<OrderOption> = [];
  order_optional_items: Array<OptionalOrderItem> = [];

  status: string = "";
  status_history: Array<any> = []; 
  created_at: number = Date.now();
  update_at: number = Date.now();

}

export class OrderOption {
  description: string = "";
  value: string = "";
}

export class OptionalOrderItem {
  title: string = "";
  item_note: string = "";
  price: number = 0.00;
}

// { Open, Confirmed, Payed, Shipped, Delivered, Finished, Canceled}
// export class OrderStatus {
//   status: string = "Open";
//   current: boolean = true;
//   created_at: number = Date.now();
// }