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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.signUpAuthController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponce_1 = __importDefault(require("../../../shared/sendResponce"));
const config_1 = __importDefault(require("../../../config"));
const auth_sevices_1 = require("./auth.sevices");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    // console.log(loginData,"asdfsd");
    const result = yield auth_sevices_1.authServices.authLoginServices(loginData);
    const { refreshToken } = result, others = __rest(result, ["refreshToken"]);
    const cookieOption = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOption);
    if (result) {
        (0, sendResponce_1.default)(res, {
            success: true,
            message: 'successfully User Login',
            statusCode: 200,
            data: others,
        });
    }
}));
const refreshTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.headers.authorization;
    // const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, `You are not authorized`);
    }
    const result = yield auth_sevices_1.authServices.refreshTokenServices(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponce_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User lohggedin successfully !',
        data: result || null,
    });
}));
exports.signUpAuthController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = __rest(req.body, []);
    // console.log(user, 'from controller=================');
    const result = yield (0, auth_sevices_1.signUpServices)(user);
    if (result) {
        (0, sendResponce_1.default)(res, {
            success: true,
            message: 'successfully create User',
            statusCode: 200,
            data: result,
        });
        // next()
    }
}));
exports.authController = {
    loginController,
    refreshTokenController,
    signUpAuthController: exports.signUpAuthController,
};
