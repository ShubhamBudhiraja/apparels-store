import { RESPONSE_MESSAGES } from "../../constants/responseMessages";

export const generateCommonResponse = (
    responseCode = 5001,
    responseStatus = false,
    responseBody = {},
) => {
    return {
        status: responseStatus,
        responseCode,
        // message: RESPONSE_MESSAGES[responseCode],
        message: "helo",
        responseBody,
    };
};
