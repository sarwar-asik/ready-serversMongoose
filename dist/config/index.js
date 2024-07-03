"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// dotenv.config({path:process.cwd()})
// dotenv.config({ path: path.join(process.cwd(), "env") });
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
// console.log(process.env);
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    data_url: process.env.DB_URL,
    default_user_pass: process.env.DEFAULT_STUDENT_PASSWORD,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
};
