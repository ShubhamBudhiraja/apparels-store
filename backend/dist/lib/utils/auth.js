"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUtils = void 0;
const authUtils = () => {
    const genrateOtp = (noOfDigits = 3) => {
        return `${Math.floor(Math.random() * 9 * Math.pow(10, noOfDigits) + Math.pow(10, noOfDigits))}`;
    };
    return { genrateOtp };
};
exports.authUtils = authUtils;
