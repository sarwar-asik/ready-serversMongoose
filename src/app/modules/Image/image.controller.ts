/* eslint-disable no-console */
import { Request, Response } from 'express';
import sharp from 'sharp';
import { ImageService } from './image.service';
import sendResponse from '../../../shared/sendResponce';
import httpStatus from 'http-status';
import { Image_model } from './image.model';

const create_image = async (req: Request, res: Response) => {
  // const { ...imageData } = req.body;
  const bufferFile = req.file?.buffer;
  const fileType = req.file?.mimetype.startsWith('image') ? 'jpg' : 'pdf';
  const response = await ImageService.create_image_db(bufferFile, fileType);

  if (response) {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Image created successfully',
      data: response,
    });
  }
};

const getImageUrl = async (req: Request, res: Response) => {
  console.log('get image hit');
  let fileId = req.params.id;
  fileId = fileId.replace(/\.[^/.]+$/, '');

  // const pipeline = [{ $match: { _id: new ObjectId(fileId) } }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileDoc = (await Image_model.findById(fileId)) as any;
  console.log('🚀 image.controller.ts:32', fileDoc);

  if (!fileDoc) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: true,
      message: 'Image Not Found',
      data: fileDoc,
    });
  } else {
    const fileType = fileDoc.fileType;
    const contentType = fileType === 'jpg' ? 'image/jpeg' : 'application/pdf';

    // Implement compression and optimization
    let imageBuffer = Buffer.from(fileDoc.buffer, 'base64');
    if (fileType === 'jpg') {
      imageBuffer = await sharp(imageBuffer).jpeg({ quality: 85 }).toBuffer();
    } else if (fileType === 'png') {
      imageBuffer = await sharp(imageBuffer).png({ quality: 85 }).toBuffer();
    }

    // Set the content type and status manually, as sendResponse can't handle binary data directly
    res.contentType(contentType);
    // res.status(httpStatus.OK).send(imageBuffer);
    // res.status(200).send(imageBuffer);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Image get successfully',
      data: imageBuffer,
    });
  }
};

export const ImageController = { create_image, getImageUrl };
