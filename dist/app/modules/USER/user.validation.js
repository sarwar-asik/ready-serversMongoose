"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.string({
            required_error: 'role is required',
        }),
        phoneNumber: zod_1.z.string({
            required_error: 'PhoneNumber is required',
        }),
        address: zod_1.z.string({
            required_error: 'Address is required',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string().optional(),
        }),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z
            .string({
            required_error: 'role is required',
        })
            .optional(),
        phoneNumber: zod_1.z
            .string({
            required_error: 'PhoneNumber is required',
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: 'Address is required',
        })
            .optional(),
        name: zod_1.z
            .object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
};
