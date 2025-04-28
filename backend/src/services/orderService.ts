import OrderModel, { Order } from '../models/Order';
import { Types } from 'mongoose';

export async function getAllOrders(): Promise<Order[]> {
  return await OrderModel.find();
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await OrderModel.findById(id);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  if (!Types.ObjectId.isValid(userId)) return [];
  return await OrderModel.find({ userId });
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

export async function bulkUpdateOrderStatus(
  ids: string[],
  status: string
): Promise<any> {
  const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
  if (validIds.length === 0) return { matchedCount: 0, modifiedCount: 0 };

  const ops = validIds.map((id) => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(id) },
      update: { $set: { status } }
    }
  }));

  const result = await OrderModel.bulkWrite(ops);
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
}
