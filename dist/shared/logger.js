"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = winston_1.format;
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
// custom log formate //
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${date.toDateString()},${hour}:${minute}:${second} [${label}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat, prettyPrint()),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'success', 'ph-%DATE%-success.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
        }),
    ],
});
exports.logger = logger;
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    //   format: format.json(),
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat, prettyPrint()),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'errors', 'ph-error-%DATE%-error.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '5d',
        }),
    ],
});
exports.errorLogger = errorLogger;
logger.add(new winston_1.transports.Console({
    format: winston_1.format.simple(),
}));
