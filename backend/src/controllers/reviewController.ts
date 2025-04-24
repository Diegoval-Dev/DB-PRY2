import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export async function getAllReviews(req: Request, res: Response) {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error });
  }
}

export async function getReviewById(req: Request, res: Response) {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving review', error });
  }
}

export async function createReview(req: Request, res: Response) {
  try {
    const newReview = await reviewService.createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
}

export async function updateReview(req: Request, res: Response) {
  try {
    const updated = await reviewService.updateReview(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const deleted = await reviewService.deleteReview(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
}
