"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/USER/user.route");
const auth_route_1 = require("../modules/AUTH/auth.route");
const image_route_1 = require("../modules/Image/image.route");
const router = express_1.default.Router();
const modulesRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/users',
        route: user_route_1.UserRouter,
    },
    {
        path: '/image',
        route: image_route_1.ImageRoutes,
    },
];
modulesRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
