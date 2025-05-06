// backend/src/api/restaurants.ts

import { Router } from 'express';
import { query, param, body } from 'express-validator';
import {
  listRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getNearbyRestaurants,
} from '../controllers/restaurantController';
import {
  getReviewsByRestaurant
} from '../controllers/reviewController';
import { getMenuByRestaurant } from '../controllers/menuItemController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/restaurants
router.get('/', listRestaurants);

// GET /api/restaurants/nearby?lng=&lat=&maxDistance=
router.get(
  '/nearby',
  validate([
    query('lng').isFloat().withMessage('lng must be a number'),
    query('lat').isFloat().withMessage('lat must be a number'),
    query('maxDistance')
      .isInt({ gt: 0 })
      .withMessage('maxDistance must be a positive integer')
  ]),
  getNearbyRestaurants
);

// GET /api/restaurants/:id
router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid restaurant ID')]),
  getRestaurantById
);

router.get(
  '/:id/menu',
  validate([ param('id').isMongoId().withMessage('Invalid restaurant ID') ]),
  getMenuByRestaurant
);

router.get(
  '/:id/reviews',
  validate([param('id').isMongoId().withMessage('Invalid restaurant ID')]),
  getReviewsByRestaurant
);


// POST /api/restaurants
router.post(
  '/',
  validate([
    body('name').isString().withMessage('Name is required'),
    body('address').isString().withMessage('Address is required'),
    body('location.type').equals('Point'),
    body('location.coordinates').isArray({ min: 2, max: 2 }),
    body('location.coordinates.*').isFloat(),
    body('specialties').isArray({ min: 1 }),
    body('specialties.*').isString()
  ]),
  createRestaurant
);

// PUT /api/restaurants/:id
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid restaurant ID'),
    body('name').optional().isString(),
    body('address').optional().isString(),
    body('location.type').optional().equals('Point'),
    body('location.coordinates').optional().isArray({ min: 2, max: 2 }),
    body('location.coordinates.*').optional().isFloat(),
    body('specialties').optional().isArray(),
    body('specialties.*').optional().isString()
  ]),
  updateRestaurant
);

// DELETE /api/restaurants/:id
router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid restaurant ID')]),
  deleteRestaurant
);

export default router;
