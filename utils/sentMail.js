const dotenv = require("dotenv")
dotenv.config({path:"./config.env"}) 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_MAIL_USER,
        pass: process.env.NODE_MAIL_PASS,
    },
});



exports.sendEmail = async (to,otp) => {
    console.log(to,otp)
    const mailOptions = {
        from: process.env.NODE_MAIL_USER, // Sender address
        to: to, // Receiver address
        subject: 'Your student portal password reset OTP',
        text: `Your otp is ${otp} don't share anyone and it will expires in 2 minits `, 
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
        return true
    } catch (error) {
        return false
    }
};
