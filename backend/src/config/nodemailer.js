const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: "sb13092000@gmail.com",
        pass: "pfog ebml dzwg mozw",
    },
});

const sendEmailOtp = async (email, otp) => {
    await transporter.sendMail(
        {
            from: `"Apparel Store" <sb13092000@gmail.com>`, // sender address
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
