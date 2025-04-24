import OrderModel, { Order } from '../models/Order';
import { Types } from 'mongoose';

export async function getAllOrders(): Promise<Order[]> {
  return await OrderModel.find();
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await OrderModel.findById(id);
}

export async function createOrder(data: Partial<Order>): Promise<Order> {
  const order = new OrderModel(data);
  return await order.save();
}

export async function updateOrder(
  id: string,
  data: Partial<Order>
): Promise<Order | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await OrderModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteOrder(id: string): Promise<Order | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await OrderModel.findByIdAndDelete(id);
}
