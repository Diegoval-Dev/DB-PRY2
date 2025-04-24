import ReviewModel, { Review } from '../models/Review';
import { Types } from 'mongoose';

export async function getAllReviews(): Promise<Review[]> {
  return await ReviewModel.find();
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await ReviewModel.findById(id);
}

export async function createReview(data: Partial<Review>): Promise<Review> {
  const review = new ReviewModel(data);
  return await review.save();
}

export async function updateReview(
  id: string,
  data: Partial<Review>
): Promise<Review | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await ReviewModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteReview(id: string): Promise<Review | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await ReviewModel.findByIdAndDelete(id);
}
