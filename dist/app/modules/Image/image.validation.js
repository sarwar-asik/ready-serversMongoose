"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidation = void 0;
const zod_1 = require("zod");
const create_Image = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.number({
            required_error: 'title is Required (zod)',
        }),
        userId: zod_1.z.string({
            required_error: 'userId is Required (zod)',
        })
    }),
});
exports.ImageValidation = { create_Image };
