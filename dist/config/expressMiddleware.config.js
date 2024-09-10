"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helmetConfig = exports.limiterRate = exports.compressionOptions = void 0;
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
exports.compressionOptions = {
    threshold: 2048,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            // Don't compress responses if this request header is present
            return false;
        }
        return compression_1.default.filter(req, res);
    },
};
exports.limiterRate = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // store: ... , // Redis, Memcached, etc. See below.
    message: 'Too many requests, please try again later.',
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    skip: (req, res) => ['192.168.10.239'].includes(req.ip), //those will pass through the limit request
});
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            //   scriptSrc: ["'self'", "'unsafe-inline'", "example.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    //   expectCt: {
    //     enforce: true,
    //     maxAge: 86400, // 1 day in seconds
    //   },
    frameguard: { action: 'deny' },
    hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
    },
    hidePoweredBy: true,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
});
