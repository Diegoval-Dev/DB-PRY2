import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { getOrdersByUser } from '../controllers/orderController';
import { validate } from '../lib/validators';
import {
  getReviewsByUser
} from '../controllers/reviewController';
const router = Router();

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid user ID')
  ]),
  getUserById
);

// GET /api/users/:id/orders
router.get(
  '/:id/orders',
  validate([
    param('id').isMongoId().withMessage('Invalid user ID')
  ]),
  getOrdersByUser
);

router.get(
  '/:id/reviews',
  validate([param('id').isMongoId().withMessage('Invalid user ID')]),
  getReviewsByUser
);


// POST /api/users
router.post(
  '/',
  validate([
    body('name')
      .isString().withMessage('Name must be a string')
      .notEmpty().withMessage('Name is required'),
    body('email')
      .isEmail().withMessage('Must be a valid email'),
    body('role')
      .isIn(['cliente', 'admin', 'repartidor'])
      .withMessage('Role must be cliente, admin or repartidor')
  ]),
  createUser
);

// PUT /api/users/:id
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('role')
      .optional()
      .isIn(['cliente', 'admin', 'repartidor'])
      .withMessage('Role must be cliente, admin or repartidor')
  ]),
  updateUser
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid user ID')
  ]),
  deleteUser
);

export default router;
