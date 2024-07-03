"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const ResponseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: (data === null || data === void 0 ? void 0 : data.meta) || null,
        data: (data === null || data === void 0 ? void 0 : data.data) || null,
    };
    res.status(data.statusCode).json(ResponseData);
};
exports.default = sendResponse;
