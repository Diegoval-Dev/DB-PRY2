// backend/src/api/reviews.ts

import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByRestaurant
} from '../controllers/reviewController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/:id
router.get(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID')
  ]),
  getReviewById
);

//GET /api/reviews/restaurant/:id
router.get(
  '/restaurant/:restaurantId',
  validate([
    param('restaurantId')
      .isMongoId()
      .withMessage('Invalid restaurant ID')
  ]),
  getReviewsByRestaurant
);

// POST /api/reviews
router.post(
  '/',
  validate([
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('restaurantId')
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
      .isString()
      .withMessage('Comment must be a string')
      .notEmpty()
      .withMessage('Comment is required'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date')
  ]),
  createReview
);

// PUT /api/reviews/:id
router.put(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),
    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('restaurantId')
      .optional()
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('orderId')
      .optional()
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
      .optional()
      .isString()
      .withMessage('Comment must be a string'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date')
  ]),
  updateReview
);

// DELETE /api/reviews/:id
router.delete(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID')
  ]),
  deleteReview
);

export default router;
