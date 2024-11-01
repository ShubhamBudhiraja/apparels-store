const RESPONSE_MESSAGES = require("../constants/responseMessages")

const commonUtils = () => {
    const generateCommonResponse = (responseCode = 5001, responseStatus = false, responseBody = null) => {
        return ({
            status: responseStatus, responseCode, message: RESPONSE_MESSAGES[responseCode], responseBody
        })
    }

    return { generateCommonResponse }
}

module.exports = commonUtils