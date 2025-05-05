import { Schema, model, Document, Types } from 'mongoose';

export interface MenuItem extends Document {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageId: string;
}

const MenuItemSchema = new Schema<MenuItem>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  imageId: String
});

MenuItemSchema.index({ restaurantId: 1, category: 1 });   
MenuItemSchema.index({ price: 1 });   

MenuItemSchema.index({ restaurantId: 1, category: 1 });

export default model<MenuItem>('MenuItem', MenuItemSchema);
