// backend/src/services/authService.ts
import UserModel, { User } from '../models/User';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as jwt.Secret;
const JWT_EXPIRES_IN = '10h';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'cliente' | 'admin' | 'repartidor';
}): Promise<User> {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(data.password, salt);
  const user = new UserModel({ ...data, password: hash });
  return await user.save();
}

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  const signOptions: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN };
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    signOptions
  );
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
