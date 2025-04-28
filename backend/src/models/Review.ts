import { Schema, model, Document, Types } from 'mongoose';

export interface Review extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  orderId: Types.ObjectId;
  rating: number;
  comment: string;
  date: Date;
}

const ReviewSchema = new Schema<Review>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  date: { type: Date, default: Date.now }
});

ReviewSchema.index({ comment: 'text' });
ReviewSchema.index({ rating: 1, date: -1 });     

export default model<Review>('Review', ReviewSchema);
