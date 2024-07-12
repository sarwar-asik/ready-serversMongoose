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
exports.UserService = void 0;
/* eslint-disable no-console */
const user_model_1 = require("./user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createUserServices = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(user, 'from services');
    const createdUser = yield user_model_1.User.create(user);
    if (!createdUser) {
        throw new ApiError_1.default(400, 'Failed to create new User');
    }
    return createdUser;
    // return null
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const myProfileServices = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id).select('name phoneNumber address');
    return result;
});
const updateMyProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    let responseData = null;
    if (result) {
        responseData = {
            name: result === null || result === void 0 ? void 0 : result.name,
            phoneNumber: result === null || result === void 0 ? void 0 : result.phoneNumber,
            address: result === null || result === void 0 ? void 0 : result.address
        };
    }
    return responseData;
});
exports.UserService = { createUserServices, getSingleUser, deleteUser, updateUser, myProfileServices, updateMyProfile };
