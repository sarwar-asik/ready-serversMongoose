"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateUserRequest_1 = __importDefault(require("../../middlesWare/validateUserRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlesWare/auth"));
const router = express_1.default.Router();
// it is optional
router.post('/create-user', (0, validateUserRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), (0, auth_1.default)("admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.userController.createUser);
router.get('/my-profile', 
// auth(ENUM_USER_ROLE.ADMIN),
user_controller_1.userController.myProfileController);
router.get('/:id', (0, auth_1.default)("admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.userController.getSingleUser);
router.get('/', (0, auth_1.default)("admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.userController.getALLUser);
router.delete('/:id', (0, auth_1.default)("admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.userController.deleteUser);
router.patch('/my-profile', (0, validateUserRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), user_controller_1.userController.updateMyProfile);
router.patch('/:id', (0, validateUserRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), (0, auth_1.default)("admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.userController.updateUser);
exports.UserRouter = router;
