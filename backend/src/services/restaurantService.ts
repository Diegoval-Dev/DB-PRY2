import RestaurantModel, { Restaurant } from '../models/Restaurant';
import { Types } from 'mongoose';
import { FilterQuery } from 'mongoose';

export interface RestaurantQueryOptions {
  filter?: FilterQuery<Restaurant>;   
  projection?: string[];
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
}

export async function getRestaurants(
  opts: RestaurantQueryOptions
): Promise<{ data: Restaurant[]; total: number }> {
  const {
    filter = {} as FilterQuery<Restaurant>,
    projection,
    sort = { name: 1 },
    page = 1,
    limit = 10
  } = opts;

  // 1) Construir la consulta con lean()
  let cursor = RestaurantModel.find(filter).lean();

  // 2) Proyección
  if (projection) {
    const projObj = projection.reduce((acc, f) => ({ ...acc, [f]: 1 }), {});
    cursor = cursor.select(projObj);
  }

  // 3) Contar total
  const total = await RestaurantModel.countDocuments(filter);

  // 4) Ordenar, skip & limit
  cursor = cursor.sort(sort).skip((page - 1) * limit).limit(limit);

  // 5) Ejecutar y devolver como plain objects
  const data = await cursor.exec();
  return { data, total };
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await RestaurantModel.findById(id);
}

export async function createRestaurant(
  data: Partial<Restaurant>
): Promise<Restaurant> {
  const restaurant = new RestaurantModel(data);
  return await restaurant.save();
}

export async function updateRestaurant(
  id: string,
  data: Partial<Restaurant>
): Promise<Restaurant | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await RestaurantModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteRestaurant(id: string): Promise<Restaurant | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await RestaurantModel.findByIdAndDelete(id);
}

export async function getNearbyRestaurants(
  lng: number,
  lat: number,
  maxDistance: number
): Promise<Restaurant[]> {
  return await RestaurantModel.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: maxDistance
      }
    }
  });
}