import { Router } from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';

const router = Router();

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/:id
router.get('/:id', getReviewById);

// POST /api/reviews
router.post('/', createReview);

// PUT /api/reviews/:id
router.put('/:id', updateReview);

// DELETE /api/reviews/:id
router.delete('/:id', deleteReview);

export default router;
