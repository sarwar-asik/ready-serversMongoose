import { Schema } from 'mongoose';
import { IImage } from './image.interface';
import { model } from 'mongoose';

const ImageSchema: Schema<IImage> = new Schema<IImage>(
  {
    buffer: { type: Buffer, required: true },
    fileType: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Image_model = model<IImage>('Image', ImageSchema);
