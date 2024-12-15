export const customCorsOptions = {
    origin: (_origin: any, callback: any) => {
        callback(null, true);
    },
};
