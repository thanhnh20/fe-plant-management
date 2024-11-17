import { Product } from "./Product";
import { User } from "./User";

export interface Order {
  id: number,
  total_price: number,
  status: string,
  order_date: string,
  callback: string,
  shipping_fee: number,
  voucher_code: string,
  discount_amount: number,
  note: string,
  shipping_address: string,
  payment_method: string,
  createdAt: string,
  updatedAt: string,
  User: User
}

export interface OrderDetail {
  status: string,
  id: number,
  user_id: number,
  user_name: string,
  user_phone: string,
  total_price: number,
  order_date: string,
  callback: string,
  shipping_fee: number,
  voucher_code: string,
  discount_amount: number,
  note: string,
  shipping_address: string,
  payment_method: string,
  createdAt: string,
  updatedAt: string,
  products: OrderProduct[]
}

export interface OrderProduct {
  name: string,
  imageUrl: string,
  quantity: number,
  price: number
}
