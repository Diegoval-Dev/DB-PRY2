// backend/src/api/menuItems.ts

import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  listMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createMenuItemsBulk,
  updateMenuItemsBulk, 
  deleteMenuItemsBulk
} from '../controllers/menuItemController';
import { validate } from '../lib/validators';

const router = Router();

// GET /api/menu-items
router.get('/', listMenuItems);

// GET /api/menu-items/:id
router.get(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid menuItem ID')
  ]),
  getMenuItemById
);

// POST /api/menu-items
router.post(
  '/',
  validate([
    body('restaurantId')
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('name')
      .isString().withMessage('Name must be a string')
      .notEmpty().withMessage('Name is required'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('price')
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .optional()
      .isString().withMessage('Category must be a string'),
    body('imageId')
      .optional()
      .isString().withMessage('Image ID must be a string')
  ]),
  createMenuItem
);

// POST /api/menu-items/bulk
router.post('/bulk', createMenuItemsBulk);

// **Bulk update**
// PUT /api/menu-items/bulk
router.put('/bulk', updateMenuItemsBulk);

// **Bulk delete**
// DELETE /api/menu-items/bulk
router.delete('/bulk', deleteMenuItemsBulk);


// PUT /api/menu-items/:id
router.put(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid menuItem ID'),
    body('restaurantId')
      .optional()
      .isMongoId()
      .withMessage('Invalid restaurant ID'),
    body('name')
      .optional()
      .isString().withMessage('Name must be a string'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('price')
      .optional()
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .optional()
      .isString().withMessage('Category must be a string'),
    body('imageId')
      .optional()
      .isString().withMessage('Image ID must be a string')
  ]),
  updateMenuItem
);

// DELETE /api/menu-items/:id
router.delete(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid menuItem ID')
  ]),
  deleteMenuItem
);

export default router;
