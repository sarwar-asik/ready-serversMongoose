"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image_model = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    buffer: { type: Buffer, required: true },
    fileType: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Image_model = (0, mongoose_2.model)('Image', ImageSchema);
