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
exports.authServices = exports.signUpServices = void 0;
/* eslint-disable no-var */
/* eslint-disable no-console */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
require("colors");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = require("../USER/user.model");
const authLoginServices = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield user_model_1.User.isUserExistsMethod(phoneNumber);
    // console.log(isUserExist,"isUserExits");
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not match');
    }
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatchMethod(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Password is not correct');
    }
    // console.log(isUserExist,"isUserExist");
    const { role, _id, phoneNumber: existphoneNumber } = isUserExist;
    //   jwt part ///
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role, phoneNumber: existphoneNumber }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role, phoneNumber: existphoneNumber }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    // eslint-disable-next-line no-console
    console.log('accessToken', accessToken, 'refreshToken', refreshToken, 'refreshToken');
    return {
        accessToken,
        refreshToken,
    };
    // return payload
});
const refreshTokenServices = (token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token, 'from refreshTokenService'.red.bold);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
        console.log(verifiedToken, 'verifyToken'.red.bold);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid your refreshToken');
    }
    const { phoneNumber, role, _id } = verifiedToken;
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ role, _id, phoneNumber }, config_1.default.jwt.refresh_secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const signUpServices = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(user, 'from services');
    const createdUser = yield user_model_1.User.create(user);
    if (!createdUser) {
        throw new ApiError_1.default(400, 'Failed to create new User');
    }
    return createdUser;
    // return null;
});
exports.signUpServices = signUpServices;
exports.authServices = {
    authLoginServices,
    refreshTokenServices,
    signUpServices: exports.signUpServices,
};
