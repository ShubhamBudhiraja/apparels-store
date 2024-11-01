const authUtils = () => {
    const genrateOtp = (noOfDigits = 3) => {
        return `${Math.floor((Math.random() * 9 * (Math.pow(10, noOfDigits))) + (Math.pow(10, noOfDigits)))}`
    }

    return { genrateOtp }
}

module.exports = authUtils