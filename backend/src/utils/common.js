const RESPONSE_MESSAGES = require("../constants/responseMessages")

const generateCommonResponse = (responseCode = 5001, responseStatus = false, responseBody = null) => {
    return ({
        status: responseStatus, responseCode, message: RESPONSE_MESSAGES[responseCode], responseBody
    })
}

const commonUtils = { generateCommonResponse }
module.exports = commonUtils