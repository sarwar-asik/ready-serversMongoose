/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  _id?: Types.ObjectId;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  address: string;
  budget?: number;
  income?: number;
};

export type UserModel = {
  isUserExistsMethod(
    email: string,
  ): Promise<Pick<IUser, 'password' | 'role' | 'email' | '_id'>>;
  isPasswordMatchMethod(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean | null>;
} & Model<IUser>;
