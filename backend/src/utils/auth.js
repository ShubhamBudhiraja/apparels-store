const getOtp = (noOfDigits = 3) => {
    return Math.floor((Math.random() * 9 * (Math.pow(10, noOfDigits))) + (Math.pow(10, noOfDigits)))
}

const authUtils = { getOtp }

module.exports = authUtils