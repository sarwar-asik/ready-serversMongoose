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
exports.createUserAuthServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../USER/user.model");
const createUserAuthServices = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(user, 'from services');
    const createdUser = yield user_model_1.User.create(user);
    if (!createdUser) {
        throw new ApiError_1.default(400, 'Failed to create new User');
    }
    return createdUser;
    return null;
});
exports.createUserAuthServices = createUserAuthServices;
