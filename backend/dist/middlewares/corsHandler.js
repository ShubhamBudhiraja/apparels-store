"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCorsOptions = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.customCorsOptions = {
    origin: (origin, callback) => {
        if (process.env.ALLOWED_ORIGINS) {
            const allowedOrigins = process.env.ALLOWED_ORIGINS.split(" ");
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Request from unauthorized origin"));
            }
        }
    },
};
