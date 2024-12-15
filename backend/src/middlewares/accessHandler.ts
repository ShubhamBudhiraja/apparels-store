import { NextFunction, Request, Response } from "express";

export const handleAppAccess = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req?.headers?.host)
        if (!process.env.ALLOWED_HOSTS?.split(" ").includes(req?.headers?.host))
            res.status(500).send("Unauthorised User");
        else next();
    else res.status(500).send("Unauthorised User");
};
