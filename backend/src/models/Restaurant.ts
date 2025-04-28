import { Schema, model, Document } from 'mongoose';

export interface Restaurant extends Document {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  specialties: string[];
  imageIds: string[];
}

const RestaurantSchema = new Schema<Restaurant>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  specialties: [String],
  imageIds: [String]
});

RestaurantSchema.index({ location: '2dsphere' });      
RestaurantSchema.index({ specialties: 1 });    

RestaurantSchema.index({ location: '2dsphere' });

export default model<Restaurant>('Restaurant', RestaurantSchema);
