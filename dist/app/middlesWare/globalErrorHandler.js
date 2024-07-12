"use strict";
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../config/index"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const index_2 = __importDefault(require("../../config/index"));
// import { errorLogger } from '../../shared/logger'
const zod_1 = require("zod");
const handleZOdError_1 = __importDefault(require("../../errors/handleZOdError"));
const handleCastError_1 = __importDefault(require("../../errors/handleCastError"));
const GlobalHandler = (error, req, res, next) => {
    index_2.default.env === 'development'
        ? console.log('globalErrorHandler', error)
        : console.log('Error from globalError', error);
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessage = [];
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidatorError') {
        const simplifiedMessage = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedMessage === null || simplifiedMessage === void 0 ? void 0 : simplifiedMessage.statusCode;
        message = simplifiedMessage === null || simplifiedMessage === void 0 ? void 0 : simplifiedMessage.message;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZOdError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        // res.status(400).json({error})
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message) ? [{ path: '', message: message }] : [];
    }
    else if (error instanceof Error) {
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [{ path: '', message: error === null || error === void 0 ? void 0 : error.message }]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        stack: index_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
    // next()
};
exports.default = GlobalHandler;
