import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
import crypto from "crypto";
dotenv.config();

import redisClient from "../../../config/redis/redis.js";
import AppError from "../../../utils/appError.js";
import findUser from "../../../repository/auth/user/find_user_repository.js";
import transporter from "../../../utils/email_template/transporter.js";
import getTemplateEmailResetPassword from "../../../utils/email_template/user/get_template_email_reset_password.js";

const sendForgetPasswordMailService = async (email) => {
  const generateResetCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8);
  const resetCode = generateResetCode();

  const whereClause = {
    email: email
  };

  const existingResetKey= await redisClient.keys(`forget_password_token:${email}`);
  if(existingResetKey.length > 0){
    const ttl = await redisClient.ttl(`forget_password_token:${email}`);
    const minutesLeft = Math.ceil(ttl/60)
   throw new AppError(`Please wait ${minutesLeft} minutes before requesting again.`, 429);
  }

  const user = await findUser(whereClause);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.is_verified){
    throw new AppError("please verified first your account",401)
  }
  const hmacSecret = process.env.HMAC_SECRET_KEY;
  const hashResetCode  = crypto.createHmac('sha256', hmacSecret).update(resetCode).digest('hex');
  await redisClient.set(`forget_password_token:${email}`,hashResetCode, { EX:300})

  const htmlContent = getTemplateEmailResetPassword(resetCode);
   const mailOptions = {
        from: process.env.SMTP_FROM_NAME,
        to: user.email,
        subject: "Reset Your Password - Mivva Go",
        html: htmlContent
    };
  const sendMailResponse = await transporter.sendMail(mailOptions);
  if (!sendMailResponse) {
    throw new AppError("Failed to send reset password email", 500);
  }
  return {
    success: true,
    message: "Reset password email sent successfully",
  };
};

export default sendForgetPasswordMailService;
