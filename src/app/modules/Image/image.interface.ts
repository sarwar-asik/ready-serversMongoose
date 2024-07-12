import { Model, ObjectId } from 'mongoose';

export type IImage = {
  buffer: Buffer;
  fileType: ObjectId;
};

export type Image = Model<IImage, Record<string, unknown>>;
