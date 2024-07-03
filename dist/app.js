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
/* eslint-disable no-console */
const http_status_1 = __importDefault(require("http-status"));
// const express = require('express')
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlesWare/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const sendResponce_1 = __importDefault(require("./shared/sendResponce"));
// import { generateFacultyId } from './app/modules/users/user.utils';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { createUser } from './app/modules/users/users.services'
const app = (0, express_1.default)();
// const port = 3000
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Application
// app.use('/api/v1/users', UserRouter)
// app.use("/api/v1/semester",semesterRouter)
//*** */ or ***////
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  const addUser = await createUser({id:"445",role:"admin",password:"asdfasdf"})
    // res.send(addUser)
    // throw new ApiError(400, 'Error from app.ts')
    // Promise.reject(new Error('Unhandle Promise from app.ts'))
    // throw new Error("Error from app.get")
    // next("next error")
    (0, sendResponce_1.default)(res, {
        success: true,
        message: 'Running the Sarwar server',
        statusCode: 201,
        data: null,
    });
    // next();
}));
app.use(globalErrorHandler_1.default);
// for unknown apiii hit error handle
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'NOt Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
// for testing userId dynamic based on yaer and code ///
// const academicSemester = {
//   code: '01',
//   year: '2025',
// };
const testId = () => __awaiter(void 0, void 0, void 0, function* () {
    // const testId = await generateFacultyId();
    console.log(testId, 'testId from app.ts');
});
testId();
exports.default = app;
