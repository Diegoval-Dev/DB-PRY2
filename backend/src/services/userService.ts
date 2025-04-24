import UserModel, { User } from '../models/User';
import { Types } from 'mongoose';

export async function getAllUsers(): Promise<User[]> {
  return await UserModel.find();
}

export async function getUserById(id: string): Promise<User | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await UserModel.findById(id);
}

export async function createUser(data: Partial<User>): Promise<User> {
  const newUser = new UserModel(data);
  return await newUser.save();
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteUser(id: string): Promise<User | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return await UserModel.findByIdAndDelete(id);
}
