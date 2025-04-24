import { Router } from 'express';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuItemController';

const router = Router();

// GET /api/menu-items
router.get('/', getAllMenuItems);

// GET /api/menu-items/:id
router.get('/:id', getMenuItemById);

// POST /api/menu-items
router.post('/', createMenuItem);

// PUT /api/menu-items/:id
router.put('/:id', updateMenuItem);

// DELETE /api/menu-items/:id
router.delete('/:id', deleteMenuItem);

export default router;
