import MenuItemModel, { MenuItem } from '../models/MenuItem';
import { Types } from 'mongoose';

export async function getAllMenuItems(): Promise<MenuItem[]> {
  return await MenuItemModel.find();
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await MenuItemModel.findById(id);
}

export async function getMenuItemsByRestaurant(
  restaurantId: string
): Promise<MenuItem[]> {
  if (!Types.ObjectId.isValid(restaurantId)) return [];
  return await MenuItemModel.find({ restaurantId });
}

export async function createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
  const menuItem = new MenuItemModel(data);
  return await menuItem.save();
}

export async function updateMenuItem(
  id: string,
  data: Partial<MenuItem>
): Promise<MenuItem | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await MenuItemModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMenuItem(id: string): Promise<MenuItem | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await MenuItemModel.findByIdAndDelete(id);
}
