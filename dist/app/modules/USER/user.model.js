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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// const Roles = {
//   Seller : "seller",
//   Buyer :"buyer",
// }
const UserSchema = new mongoose_1.Schema({
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['buyer', 'seller', 'admin'] },
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: {
        type: Number,
        required: function () {
            return this.role === 'buyer';
        },
    },
    income: {
        type: Number,
        required: function () {
            return this.role === 'seller';
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
UserSchema.statics.isUserExistsMethod = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("hitted isUserExistsMethod");
        const user = yield exports.User.findOne({ phoneNumber }, { phoneNumber: 1, password: 1, role: 1, _id: 1 });
        return user;
    });
};
UserSchema.statics.isPasswordMatchMethod = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
UserSchema.pre('save', function (next) {
    if (this.role === 'buyer') {
        console.log(this.budget, 'from prehook');
        this.income = 0;
    }
    else if (this.role === 'seller') {
        this.budget = 0;
    }
    next();
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(10));
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
