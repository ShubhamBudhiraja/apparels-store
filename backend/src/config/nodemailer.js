const nodemailer = require("nodemailer");
const dotEnv = require("dotenv");

dotEnv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const sendEmailOtp = async (email, otp) => {
    await transporter.sendMail(
        {
            from: `"Apparel Store" <${process.env.NODEMAILER_USERNAME}>`, // sender address
            to: email, // list of receivers
            subject: "Apparel Store | Verify email address", // Subject line
            html: `Login with the below OTP:<br/>${otp}`, // html body
        },
        (error, emailResponse) => {
            if (error) {
                throw error;
            }
            console.log("Email Response ->", emailResponse);
        }
    );
};

module.exports = sendEmailOtp;
