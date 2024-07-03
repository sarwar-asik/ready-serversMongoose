"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSignUPRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateUserRequest_1 = __importDefault(require("../../middlesWare/validateUserRequest"));
const signup_controller_1 = require("./signup.controller");
const user_validation_1 = require("../USER/user.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validateUserRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), signup_controller_1.createUserAuthController);
exports.AuthSignUPRouter = router;
