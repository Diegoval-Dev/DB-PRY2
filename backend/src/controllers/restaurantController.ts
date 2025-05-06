import { Request, Response, NextFunction } from 'express';
import * as restaurantService from '../services/restaurantService';
import { BASE_URL } from '../lib/config';

function withImageUrls(rest: any) {
  return {
    ...rest.toObject(),
    imageUrls: rest.imageIds.map((id: string) => `${BASE_URL}/api/files/${id}`)
  };
}

export async function listRestaurants(req: Request, res: Response) {
  try {
    // Parsear parámetros de query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortField = (req.query.sortBy as string) || 'name';
    const sortDir = req.query.sortDir === 'desc' ? -1 : 1;
    const fields = (req.query.fields as string)?.split(',') || undefined;
    const specialty = req.query.specialty as string | undefined;

    const filter: any = {};
    if (specialty) filter.specialties = specialty;

    const { data, total } = await restaurantService.getRestaurants({
      filter,
      projection: fields,
      sort: { [sortField]: sortDir },
      page,
      limit
    });

    // Mapear URLs de imagen
    const payload = data.map(withImageUrls);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: payload
    });
  } catch (error) {
    res.status(500).json({ message: 'Error listando restaurantes', error });
  }
}

export async function getRestaurantById(req: Request, res: Response) {
  try {
    const rest = await restaurantService.getRestaurantById(req.params.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(withImageUrls(rest));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving restaurant', error });
  }
}

export async function createRestaurant(req: Request, res: Response) {
  try {
    const newRestaurant = await restaurantService.createRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
}

export async function updateRestaurant(req: Request, res: Response) {
  try {
    const updated = await restaurantService.updateRestaurant(
      req.params.id,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error });
  }
}

export async function deleteRestaurant(req: Request, res: Response) {
  try {
    const deleted = await restaurantService.deleteRestaurant(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
}

export async function getNearbyRestaurants(req: Request, res: Response, next: NextFunction) {
  try {
    const lng = parseFloat(req.query.lng as string);
    const lat = parseFloat(req.query.lat as string);
    const maxDistance = parseInt(req.query.maxDistance as string, 10);

    const list = await restaurantService.getNearbyRestaurants(lng, lat, maxDistance);
    res.json(list);
  } catch (error) {
    next(error);
  }
}