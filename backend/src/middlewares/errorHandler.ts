export const ErrorHandler = (err: any, _req: any, res: any) => {
    console.log("Middleware Error Handling");

    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: err.stack,
    });
};
