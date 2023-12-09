export const sendMail = async (
    receiverEmail: string,
    subject: string,
    template: string
) => {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailConfigs = {
        from: process.env.EMAIL_SERVER_USER,
        to: receiverEmail,
        subject: subject,
        html: template,
    };

    transporter.sendMail(mailConfigs, function (error: any, info: any) {
        if (error) throw new Error("Mail server Error")
        
        // console.log(info)
    });
};