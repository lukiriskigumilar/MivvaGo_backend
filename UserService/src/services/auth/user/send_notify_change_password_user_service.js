import dotenv from "dotenv"
dotenv.config();

import AppError from "../../../utils/appError.js"
import transporter from "../../../utils/email_template/transporter.js"
import getTemplateEmailNotifyPasswordChange from "../../../utils/email_template/user/get_template_email_notify_password_change.js";

const sendNotifyChangePasswordUserService = async (email) => {
    const template = getTemplateEmailNotifyPasswordChange();
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM_NAME,
            to: email,
            subject: "Password Change Notification",
            html: template
        });
    } catch (error) {
        throw new AppError('Error sending email', 500);
    }
}

export default sendNotifyChangePasswordUserService;
