"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAppAccess = void 0;
const handleAppAccess = (req, res, next) => {
    var _a, _b, _c;
    if ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.host)
        if (!((_b = process.env.ALLOWED_HOSTS) === null || _b === void 0 ? void 0 : _b.split(" ").includes((_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.host)))
            res.status(500).send("Unauthorised User");
        else
            next();
    else
        res.status(500).send("Unauthorised User");
};
exports.handleAppAccess = handleAppAccess;
//# sourceMappingURL=accessHandler.js.map