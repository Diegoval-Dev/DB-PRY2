// backend/src/api/restaurants.ts

import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/restaurants
router.get('/', getAllRestaurants);

// GET /api/restaurants/:id
router.get(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid restaurant ID')
  ]),
  getRestaurantById
);

// POST /api/restaurants
router.post(
  '/',
  validate([
    body('name')
      .isString()
      .withMessage('Name must be a string')
      .notEmpty()
      .withMessage('Name is required'),
    body('address')
      .isString()
      .withMessage('Address must be a string')
      .notEmpty()
      .withMessage('Address is required'),
    body('location.type')
      .equals('Point')
      .withMessage('Location type must be "Point"'),
    body('location.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of two numbers [lng, lat]'),
    body('location.coordinates.*')
      .isFloat()
      .withMessage('Each coordinate must be a number'),
    body('specialties')
      .isArray({ min: 1 })
      .withMessage('Specialties must be an array with at least one element'),
    body('specialties.*')
      .isString()
      .withMessage('Each specialty must be a string'),
    body('imageIds')
      .optional()
      .isArray()
      .withMessage('imageIds must be an array of strings'),
    body('imageIds.*')
      .optional()
      .isString()
      .withMessage('Each imageId must be a string')
  ]),
  createRestaurant
);

// PUT /api/restaurants/:id
router.put(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string'),
    body('address')
      .optional()
      .isString()
      .withMessage('Address must be a string'),
    body('location.type')
      .optional()
      .equals('Point')
      .withMessage('Location type must be "Point"'),
    body('location.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of two numbers [lng, lat]'),
    body('location.coordinates.*')
      .optional()
      .isFloat()
      .withMessage('Each coordinate must be a number'),
    body('specialties')
      .optional()
      .isArray()
      .withMessage('Specialties must be an array of strings'),
    body('specialties.*')
      .optional()
      .isString()
      .withMessage('Each specialty must be a string'),
    body('imageIds')
      .optional()
      .isArray()
      .withMessage('imageIds must be an array of strings'),
    body('imageIds.*')
      .optional()
      .isString()
      .withMessage('Each imageId must be a string')
  ]),
  updateRestaurant
);

// DELETE /api/restaurants/:id
router.delete(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid restaurant ID')
  ]),
  deleteRestaurant
);

export default router;
