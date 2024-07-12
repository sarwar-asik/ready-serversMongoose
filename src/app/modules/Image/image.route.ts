/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import multer from 'multer';
import { ImageController } from './image.controller';
import { ImageValidation } from './image.validation';
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 100 * 1024 * 1024 // 10MB file size limit
  // }
});

router.get('/get/:id', ImageController.getImageUrl);
router.put('/upload', upload.single('image'), ImageController.create_image);

export const ImageRoutes = router;
