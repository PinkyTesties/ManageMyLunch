const nodemailer = require('nodemailer');
// This function generates a random 4-digit OTP
exports.generateOTP = () => {
    let otp = '';
    for (let i = 0; i <= 3; i++) {
        const randomValue = Math.round(Math.random() * 9)
        otp += randomValue
    }
    return otp;
}
// This function creates a nodemailer transport object
exports.mailTransport = () => nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    }
});
// This function generates an email template with the OTP
exports.generateEmailTemplate = code => {
    return `
        <h1>OTP for account verification</h1>
        <p>Your OTP is ${code}</p>
    `;
}
// This function generates a plain email template
exports.plainEmailTemplate = (heading, message) => {
    return `
        <h1>${heading}</h1>
        <p>${message}</p>
    `;
}