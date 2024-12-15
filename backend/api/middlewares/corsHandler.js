"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCorsOptions = void 0;
exports.customCorsOptions = {
    origin: (_origin, callback) => {
        callback(null, true);
    },
};
//# sourceMappingURL=corsHandler.js.map