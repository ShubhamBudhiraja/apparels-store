"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommonResponse = void 0;
const responseMessages_1 = require("../../constants/responseMessages");
const generateCommonResponse = (responseCode = 5001, responseStatus = false, responseBody = {}) => {
    return {
        status: responseStatus,
        responseCode,
        message: responseMessages_1.RESPONSE_MESSAGES[responseCode],
        responseBody,
    };
};
exports.generateCommonResponse = generateCommonResponse;
