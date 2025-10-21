import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";

import AppError from "../../../utils/appError.js";
import redisClient from "../../../config/redis/redis.js";
import updateUserRepository from "../../../repository/auth/user/update_user_repository.js";
import findUser from "../../../repository/auth/user/find_user_repository.js";
import sendNotifyChangePasswordUserService from "./send_notify_change_password_user_service.js";

const confirmForgetPasswordService = async (data) =>{
    const {
        token,
        email,
        password:newPassword
    } = data 

    const hmacSecret = process.env.HMAC_SECRET_KEY;
    const hashResetCode  = crypto.createHmac('sha256', hmacSecret).update(token).digest('hex');

    const key = `forget_password_token:${email}`;
    const storedHash = await redisClient.get(key);
    if( !storedHash ){
        throw new AppError('Your email did not request password reset or token was expired', 404)
    }
    if(hashResetCode !== storedHash){
        throw new AppError('token is invalid', 401)
    }

    const user  = await findUser({ email: email });
    if(!user){
        throw new AppError('User not found', 404)
    }
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
    const dataToUpdate = {
        password: hashedPassword
    }
    const saveData = await updateUserRepository( user.id, dataToUpdate);
    await redisClient.del(key);

    //send email notify to user 
    await sendNotifyChangePasswordUserService(user.email);

    return {
        success:true,
        message:'Password has been reset successfully'
    };


    

}

export default confirmForgetPasswordService;