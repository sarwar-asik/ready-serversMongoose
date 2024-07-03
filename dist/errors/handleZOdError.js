"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZOdError = (error) => {
    const statusCode = 400;
    //   console.log(error, 'from handleZodError');
    const errors = error.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue === null || issue === void 0 ? void 0 : issue.message,
        };
    });
    return {
        statusCode,
        message: 'Validate Error from handleZodError',
        errorMessages: errors,
    };
};
exports.default = handleZOdError;
