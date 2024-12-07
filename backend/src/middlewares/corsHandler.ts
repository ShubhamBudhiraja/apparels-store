import { config } from "dotenv";

config();

export const customCorsOptions = {
    origin: (origin: any, callback: any) => {
        console.log(
            "origin - >",
            origin,
            "allowed origins - >",
            process.env.ALLOWED_ORIGINS
        );
        if (process.env.ALLOWED_ORIGINS) {
            const allowedOrigins = process.env.ALLOWED_ORIGINS.split(" ");

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Request from unauthorized origin"));
            }
        }
    },
};
