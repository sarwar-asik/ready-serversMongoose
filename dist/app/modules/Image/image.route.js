"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRoutes = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const image_controller_1 = require("./image.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    // limits: {
    //     fileSize: 100 * 1024 * 1024 // 10MB file size limit
    // }
});
router.get('/get/:id', image_controller_1.ImageController.getImageUrl);
router.put('/upload', upload.single('image'), image_controller_1.ImageController.create_image);
exports.ImageRoutes = router;
