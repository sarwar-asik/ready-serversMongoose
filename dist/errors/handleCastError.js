"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (error) => {
    const errors = [
        {
            path: error.path,
            message: error.message
        }
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "CastError Error",
        errorMessages: errors
    };
};
exports.default = handleCastError;
