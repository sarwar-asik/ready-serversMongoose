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
exports.ImageService = void 0;
const config_1 = __importDefault(require("../../../config"));
// import { IImage } from './image.interface';
const image_model_1 = require("./image.model");
const create_image_db = (bufferFile, fileType) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { buffer: bufferFile, fileType };
    const result = yield image_model_1.Image_model.create(payload);
    const image_User = `${config_1.default.server_url}/image/${result._id}/${result.id}.${fileType}`;
    return image_User;
});
// const getImageUrl = async (id: string): Promise<string> => {
// };
exports.ImageService = { create_image_db };
