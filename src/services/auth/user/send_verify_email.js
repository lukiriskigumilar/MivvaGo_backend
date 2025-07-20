import dotenv from 'dotenv';
dotenv.config();

import AppError from '../../../utils/appError.js';
import transporter from '../../../utils/email_template/transporter.js';
import findUser from "../../../repository/auth/user/find_user_repository.js";
import getTemplateEmailVerification from '../../../utils/email_template/user/get_template_email_verification.js';

const sendVerifyEmail = async (email) => {
    if (!email) {
        throw new AppError('Email is required', 400);
    }

    const whereClause = {
        email: email
    }
    const user = await findUser(whereClause);
        if (!user) {
            throw new Error('User not found');
        }
    const verificationToken = user.verification_token;
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    const verificationLink = `${baseUrl}/api/v1/auth/user/verify-email/${verificationToken}`;
    const htmlContent = getTemplateEmailVerification(user.name, verificationLink);
    const mailOptions = {
        from: process.env.SMTP_FROM_NAME,
        to: user.email,
        subject: "Verify Your Email - Mivva Go",
        html: htmlContent
    };
    const response = await transporter.sendMail(mailOptions);
    if (!response) {
        throw new AppError('Failed to send verification email', 500);
    }
    return {
        success: true,
        message: 'Verification email sent successfully'
    };
}

export default sendVerifyEmail;