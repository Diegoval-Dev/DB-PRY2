import { Schema, model, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  role: 'cliente' | 'admin' | 'repartidor';
  registrationDate: Date;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['cliente', 'admin', 'repartidor'], required: true },
  registrationDate: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 });                                   
UserSchema.index({ role: 1, registrationDate: -1 });            

export default model<User>('User', UserSchema);
