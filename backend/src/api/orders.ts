// backend/src/api/orders.ts

import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  bulkUpdateOrderStatus
} from '../controllers/orderController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/orders
router.get('/', getAllOrders);

// GET /api/orders/:id
router.get(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID')
  ]),
  getOrderById
);

// GET /api/orders/user/:id
router.get(
  '/user/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ]),
  getOrdersByUser
);

// POST /api/orders
router.post(
  '/',
  validate([
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('restaurantId')
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date'),
    body('status')
      .optional()
      .isString()
      .withMessage('Status must be a string'),
    body('total')
      .isFloat({ gt: 0 })
      .withMessage('Total must be a positive number'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items must be an array with at least one element'),
    body('items.*.menuItemId')
      .isMongoId()
      .withMessage('Each item must have a valid menuItemId'),
    body('items.*.quantity')
      .isInt({ gt: 0 })
      .withMessage('Each item quantity must be an integer greater than 0')
  ]),
  createOrder
);

// PUT /api/orders/:id
router.put(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('restaurantId')
      .optional()
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date'),
    body('status')
      .optional()
      .isString()
      .withMessage('Status must be a string'),
    body('total')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Total must be a positive number'),
    body('items')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Items must be an array with at least one element'),
    body('items.*.menuItemId')
      .optional()
      .isMongoId()
      .withMessage('Each item must have a valid menuItemId'),
    body('items.*.quantity')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('Each item quantity must be an integer greater than 0')
  ]),
  updateOrder
);

// POST /api/orders/bulk-update-status
router.post(
  '/bulk-update-status',
  validate([
    body('ids')
      .isArray({ min: 1 })
      .withMessage('ids must be a non-empty array'),
    body('ids.*')
      .isMongoId()
      .withMessage('Each id must be a valid Mongo ID'),
    body('status')
      .isString()
      .withMessage('status must be a string')
      .notEmpty()
      .withMessage('status is required')
  ]),
  bulkUpdateOrderStatus
);

// DELETE /api/orders/:id
router.delete(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID')
  ]),
  deleteOrder
);

export default router;
