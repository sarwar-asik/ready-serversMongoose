"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const sharp_1 = __importDefault(require("sharp"));
const image_service_1 = require("./image.service");
const sendResponce_1 = __importDefault(require("../../../shared/sendResponce"));
const http_status_1 = __importDefault(require("http-status"));
const image_model_1 = require("./image.model");
const create_image = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const { ...imageData } = req.body;
    const bufferFile = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
    const fileType = ((_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype.startsWith('image')) ? 'jpg' : 'pdf';
    const response = yield image_service_1.ImageService.create_image_db(bufferFile, fileType);
    if (response) {
        (0, sendResponce_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Image created successfully',
            data: response,
        });
    }
});
const getImageUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('get image hit');
    let fileId = req.params.id;
    fileId = fileId.replace(/\.[^/.]+$/, '');
    // const pipeline = [{ $match: { _id: new ObjectId(fileId) } }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileDoc = (yield image_model_1.Image_model.findById(fileId));
    console.log('🚀 image.controller.ts:32', fileDoc);
    if (!fileDoc) {
        (0, sendResponce_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: true,
            message: 'Image Not Found',
            data: fileDoc,
        });
    }
    else {
        const fileType = fileDoc.fileType;
        const contentType = fileType === 'jpg' ? 'image/jpeg' : 'application/pdf';
        // Implement compression and optimization
        let imageBuffer = Buffer.from(fileDoc.buffer, 'base64');
        if (fileType === 'jpg') {
            imageBuffer = yield (0, sharp_1.default)(imageBuffer).jpeg({ quality: 85 }).toBuffer();
        }
        else if (fileType === 'png') {
            imageBuffer = yield (0, sharp_1.default)(imageBuffer).png({ quality: 85 }).toBuffer();
        }
        // Set the content type and status manually, as sendResponse can't handle binary data directly
        res.contentType(contentType);
        // res.status(httpStatus.OK).send(imageBuffer);
        // res.status(200).send(imageBuffer);
        (0, sendResponce_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Image get successfully',
            data: imageBuffer,
        });
    }
});
exports.ImageController = { create_image, getImageUrl };
