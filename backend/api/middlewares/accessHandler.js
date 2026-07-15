"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAppAccess = void 0;
const parseAllowedHosts = () => (process.env.ALLOWED_HOSTS || "")
    .replace(/["']/g, "")
    .split(/[\s,]+/)
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
const getRequestHost = (req) => {
    const forwarded = req.headers["x-forwarded-host"];
    const raw = ((Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
        req.headers.host ||
        "")
        .toString()
        .split(",")[0]
        .trim()
        .toLowerCase();
    return raw;
};
const getOriginHost = (req) => {
    const origin = req.headers.origin;
    if (!origin)
        return "";
    try {
        return new URL(origin).host.toLowerCase();
    }
    catch (_a) {
        return "";
    }
};
const handleAppAccess = (req, res, next) => {
    const allowedHosts = parseAllowedHosts();
    // Fail open only if allowlist is unset (local misconfig); otherwise enforce.
    if (!allowedHosts.length) {
        console.warn("ALLOWED_HOSTS is empty - blocking request");
        res.status(401).send("Unauthorised User");
        return;
    }
    const requestHost = getRequestHost(req);
    const originHost = getOriginHost(req);
    const isAllowed = (requestHost && allowedHosts.includes(requestHost)) ||
        (originHost && allowedHosts.includes(originHost));
    if (!isAllowed) {
        console.log("blocked request", {
            requestHost,
            originHost,
            allowedHosts,
        });
        res.status(401).send("Unauthorised User");
        return;
    }
    next();
};
exports.handleAppAccess = handleAppAccess;
//# sourceMappingURL=accessHandler.js.map