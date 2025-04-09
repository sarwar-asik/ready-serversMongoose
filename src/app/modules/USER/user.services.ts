/* eslint-disable no-console */
import { User } from './user.model';
import { IUser } from './user.interface';

import ApiError from '../../../errors/ApiError';

const createUserServices = async (user: IUser): Promise<IUser | null> => {
  // console.log(user, 'from services');

  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create new User');
  }
  return createdUser;
  // return null
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id)

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};


const myProfileServices = async (id: string): Promise<Partial<IUser> | null> => {
  const result = await User.findById(id).select('name email address')

  return result;
};



const updateMyProfile = async (
  id: string,
  payload: Partial<IUser>
): Promise<Partial<IUser> | null> => {
  console.log(payload);


  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  let responseData = null
  if (result) {
    responseData = {
      name: result?.name,
      email: result?.email,
      address: result?.address
    }
  }
  return responseData;
};

export const UserService = { createUserServices, getSingleUser, deleteUser, updateUser, myProfileServices, updateMyProfile };