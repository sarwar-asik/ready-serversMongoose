/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Schema, Types, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';

// const Roles = {
//   Seller : "seller",
//   Buyer :"buyer",
// }

export const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['buyer', 'seller', 'admin'] },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: {
      type: Number,
      required: function (this: IUser) {
        return this.role === 'buyer';
      },
    },
    income: {
      type: Number,
      required: function (this: IUser) {
        return this.role === 'seller';
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.statics.isUserExistsMethod = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber'> | null> {
  // console.log("hitted isUserExistsMethod");
  const user = await User.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1, _id: 1 }
  );
  return user;
};

UserSchema.statics.isPasswordMatchMethod = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean | null> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre<IUser>('save', function (next) {
  if (this.role === 'buyer') {
    console.log(this.budget, 'from prehook');

    this.income = 0;
  } else if (this.role === 'seller') {
    this.budget = 0;
  }
  next();
});

UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(10));
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
