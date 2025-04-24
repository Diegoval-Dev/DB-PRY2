import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController';

const router = Router();

// GET /api/restaurants
router.get('/', getAllRestaurants);

// GET /api/restaurants/:id
router.get('/:id', getRestaurantById);

// POST /api/restaurants
router.post('/', createRestaurant);

// PUT /api/restaurants/:id
router.put('/:id', updateRestaurant);

// DELETE /api/restaurants/:id
router.delete('/:id', deleteRestaurant);

export default router;
