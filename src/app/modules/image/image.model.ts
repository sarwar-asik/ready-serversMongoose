import { Schema } from 'mongoose';
import { IImage } from './image.interface';
import { model } from 'mongoose';

const ImageSchema: Schema<IImage> = new Schema<IImage>(
  {
    buffer: { type: Buffer },
    fileType: { type: String, required: true },
    original_filename: { type: String },
    path: { type: String },
    img_url: { type: String },
    size: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Image_model = model<IImage>('Image', ImageSchema);
