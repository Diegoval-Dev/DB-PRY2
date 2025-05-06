import MenuItemModel, { MenuItem } from '../models/MenuItem';
import { HydratedDocument, Types } from 'mongoose';

export type MenuItemDoc = HydratedDocument<MenuItem>;

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


// crea muchos documentos de una vez
export async function createMenuItemsBulk(
  data: Partial<MenuItem>[]
): Promise<MenuItemDoc[]> {
  const docs = await MenuItemModel.insertMany(data);
  return docs as MenuItemDoc[];
}

// actualiza varios por criterio o lista de IDs
export async function updateMenuItemsBulk(
  filter: any,
  update: Partial<MenuItem>
): Promise<any> {
  return await MenuItemModel.updateMany(filter, update);
}

// elimina varios por lista de IDs
export async function deleteMenuItemsBulk(ids: string[]): Promise<any> {
  const objectIds = ids.map(id => new Types.ObjectId(id));
  return await MenuItemModel.deleteMany({ _id: { $in: objectIds } });
}