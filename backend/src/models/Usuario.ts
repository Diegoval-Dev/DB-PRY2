import { Schema, model, Document } from 'mongoose';

export interface Usuario extends Document {
  nombre: string;
  correo: string;
  rol: 'cliente' | 'admin' | 'repartidor';
  fechaRegistro: Date;
}

const UsuarioSchema = new Schema<Usuario>({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['cliente', 'admin', 'repartidor'], required: true },
  fechaRegistro: { type: Date, default: Date.now },
});

export default model<Usuario>('Usuario', UsuarioSchema);
