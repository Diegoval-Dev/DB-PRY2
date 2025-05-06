import MenuItemModel, { MenuItem } from '../models/MenuItem';
import { HydratedDocument, Types } from 'mongoose';
import { FilterQuery } from 'mongoose';


export interface MenuItemQueryOptions {
  filter?: FilterQuery<MenuItem>;
  projection?: string[];
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
}


export type MenuItemDoc = HydratedDocument<MenuItem>;

export async function getMenuItems(
  opts: MenuItemQueryOptions
): Promise<{ data: MenuItem[]; total: number }> {
  const {
    filter = {} as FilterQuery<MenuItem>,
    projection,
    sort = { name: 1 },
    page = 1,
    limit = 10
  } = opts;

  // 1) Construir la consulta con lean<MenuItem>()
  let cursor = MenuItemModel.find(filter).lean<MenuItem>();

  // 2) Proyección
  if (projection) {
    const projObj = projection.reduce<Record<string, 1>>(
      (acc, f) => ({ ...acc, [f]: 1 }),
      {}
    );
    cursor = cursor.select(projObj);
  }

  // 3) Contar total
  const total = await MenuItemModel.countDocuments(filter);

  // 4) Ordenar, skip & limit
  cursor = cursor.sort(sort).skip((page - 1) * limit).limit(limit);

  // 5) Ejecutar y devolver como plain objects
  const data = await cursor.exec();
  return { data, total };
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