"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateUserRequest_1 = __importDefault(require("../../middlesWare/validateUserRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const signup_controller_1 = require("./signup.controller");
const user_validation_1 = require("../USER/user.validation");
const router = express_1.default.Router();
router.post('/signup', (0, validateUserRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), signup_controller_1.createUserAuthController);
router.post('/login', (0, validateUserRequest_1.default)(auth_validation_1.AuthValidation.createUserZodSchema), auth_controller_1.authController.loginController);
router.post('/refresh-token', (0, validateUserRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.authController.refreshTokenController);
// router.get("/",userController.getUser)
exports.AuthRouter = router;
