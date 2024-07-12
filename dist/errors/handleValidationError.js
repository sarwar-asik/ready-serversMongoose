"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const handleValidationError= (err:mongoose.Error.ValidationError)=>{
// const errors:IGenericErrorMessage[]= Object.values(err.errors).map(
//     (ele:mongoose.Error.ValidationError | mongoose.Error.CastError)=>{
//         return {
//             path:ele?.path,
//             message:ele?.message
//         }
//     }
// )
// )
// }
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((element) => {
        return {
            path: element === null || element === void 0 ? void 0 : element.path,
            message: element === null || element === void 0 ? void 0 : element.message
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error",
        errorMessages: errors
    };
};
exports.default = handleValidationError;
