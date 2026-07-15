import { NextFunction, Request, Response } from "express";

const parseAllowedHosts = () =>
    (process.env.ALLOWED_HOSTS || "")
        .replace(/["']/g, "")
        .split(/[\s,]+/)
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean);

const getRequestHost = (req: Request) => {
    const forwarded = req.headers["x-forwarded-host"];
    const raw = (
        (Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
        req.headers.host ||
        ""
    )
        .toString()
        .split(",")[0]
        .trim()
        .toLowerCase();

    return raw;
};

const getOriginHost = (req: Request) => {
    const origin = req.headers.origin;
    if (!origin) return "";

    try {
        return new URL(origin).host.toLowerCase();
    } catch {
        return "";
    }
};

export const handleAppAccess = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const allowedHosts = parseAllowedHosts();

    // Fail open only if allowlist is unset (local misconfig); otherwise enforce.
    if (!allowedHosts.length) {
        console.warn("ALLOWED_HOSTS is empty - blocking request");
        res.status(401).send("Unauthorised User");
        return;
    }

    const requestHost = getRequestHost(req);
    const originHost = getOriginHost(req);

    const isAllowed =
        (requestHost && allowedHosts.includes(requestHost)) ||
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
