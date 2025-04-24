import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurantService';

export async function getAllRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving restaurants', error });
  }
}

export async function getRestaurantById(req: Request, res: Response) {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
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
