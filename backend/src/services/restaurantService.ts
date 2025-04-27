import RestaurantModel, { Restaurant } from '../models/Restaurant';
import { Types } from 'mongoose';

export async function getAllRestaurants(): Promise<Restaurant[]> {
  return await RestaurantModel.find();
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