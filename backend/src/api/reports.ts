// backend/src/api/reports.ts

import { Router } from 'express';
import { query } from 'express-validator';
import {
  topRatedRestaurants,
  mostOrderedItems,
  restaurantSales,
  userOrderFrequency,
  avgRatingBySpecialty
} from '../controllers/reportController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/reports/top-rated-restaurants?limit=
router.get(
  '/top-rated-restaurants',
  validate([
    query('limit').optional().isInt({ gt: 0 }).withMessage('limit must be a positive integer')
  ]),
  topRatedRestaurants
);

// GET /api/reports/most-ordered-items?limit=
router.get(
  '/most-ordered-items',
  validate([
    query('limit').optional().isInt({ gt: 0 }).withMessage('limit must be a positive integer')
  ]),
  mostOrderedItems
);

// GET /api/reports/restaurant-sales
router.get('/restaurant-sales', restaurantSales);

// GET /api/reports/user-order-frequency
router.get('/user-order-frequency', userOrderFrequency);

// GET /api/reports/avg-rating-by-specialty
router.get('/avg-rating-by-specialty', avgRatingBySpecialty);

export default router;
