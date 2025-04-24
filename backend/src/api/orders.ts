import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController';

const router = Router();

// GET /api/orders
router.get('/', getAllOrders);

// GET /api/orders/:id
router.get('/:id', getOrderById);

// POST /api/orders
router.post('/', createOrder);

// PUT /api/orders/:id
router.put('/:id', updateOrder);

// DELETE /api/orders/:id
router.delete('/:id', deleteOrder);

export default router;
