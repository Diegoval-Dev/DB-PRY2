import { Schema, model, Document, Types } from 'mongoose';

interface OrderItem {
  menuItemId: Types.ObjectId;
  quantity: number;
}

export interface Order extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  date: Date;
  status: string;
  total: number;
  items: OrderItem[];
}

const OrderSchema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  total: { type: Number, required: true },
  items: [
    {
      menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

OrderSchema.index({ 'items.menuItemId': 1 });

export default model<Order>('Order', OrderSchema);
