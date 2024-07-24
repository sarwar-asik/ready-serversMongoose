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
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
// import config from './config/index.js';
require("colors");
// import { logger, errorLogger } from './shared/logger';
const app_1 = __importDefault(require("./app"));
// import config from './config';
const logger_1 = require("./shared/logger");
const index_1 = __importDefault(require("./config/index"));
mongoose_1.default.set('strictQuery', false);
process.on('uncaughtException', error => {
    index_1.default.env === 'production'
        ? logger_1.errorLogger.error(error)
        : console.log('uncaugthException is detected ......', error);
    process.exit(1);
});
let server;
// console.log(config.data_url, 'config file Data'.red.bold);
function connection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url, {
                dbName: 'Ready-Server',
            });
            index_1.default.env === 'production'
                ? logger_1.logger.info(`Database connection successful`.green.underline.bold)
                : console.log(`Database connection successful`.green.underline.bold);
            app_1.default.listen(index_1.default.port, () => {
                index_1.default.env === 'production'
                    ? logger_1.logger.info(`Server is listening on port ${index_1.default.port}`.red.underline.bold)
                    : console.log(`Server is listening on port ${index_1.default.port}`.red.underline.bold);
            });
        }
        catch (error) {
            index_1.default.env === 'production'
                ? logger_1.errorLogger.error(`Failed to connect database: ${error}`.red.bold)
                : console.log(`Failed to connect database: ${error}`.red.bold);
        }
        process.on('unhandledRejection', error => {
            if (server) {
                server.close(() => {
                    index_1.default.env === 'production'
                        ? logger_1.errorLogger.error(error)
                        : console.log(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
connection();
process.on('SIGTERM', () => {
    // logger.info('SIGTERM is received ....');
    console.log('SIGTERM is received ....');
    if (server) {
        server.close();
    }
});
// console.log(config.port,"url".green.bold);
