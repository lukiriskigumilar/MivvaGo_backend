import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import AppError from "../../../utils/appError.js";
import findUser from "../../../repository/auth/user/find_user_repository.js";
import updateUserRepository from "../../../repository/auth/user/update_user_repository.js";
import sendNotifyChangePasswordUserService from "./send_notify_change_password_user_service.js";
import revokeAllSessionRepository from "../../../repository/auth/user/revoke_all_session_repository.js";
import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import redisClient from "../../../config/redis/redis.js";
import { createCookieString } from "../../../utils/cookie_helper.js";
const resetPasswordUserService = async (userId, data) => {
  const {
    old_password: oldPassword,
    new_password: newPassword,
    logout_all,
  } = data;
  const logoutAll = logout_all || false;

  //find user by id
  const user = await findUser({ id: userId });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  //validate old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("Old password not valid", 401);
  }
  //hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );

  //update user password
  const dataToUpdate = {
    password: hashedPassword,
  };
  const saveData = await updateUserRepository(userId, dataToUpdate);

  //send email notify to user 
  await sendNotifyChangePasswordUserService(user.email);


  //if logout all is true, delete all session user
  const now = new Date();
  if (logoutAll) {
    const sessionUpdate = {
      is_revoked: true,
     refresh_token_expiry: now
    };
    await revokeAllSessionRepository(userId, sessionUpdate);
    const getAllAccessToken = await findSessionUserRepository(
      { user_id: userId},
      true
    );
    const ttlInSecond = 25 * 60 * 60;
    for (const session of getAllAccessToken) {
      const accessToken = session.access_token;
      if (accessToken) {
        await redisClient.set(
          `blacklist_access_token:${accessToken}`,
          "1",
          "EX",
          ttlInSecond
        );
      }
    }
    const deletedAccessToken = createCookieString("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    return {
      user:saveData, 
      deletedAccessToken
    }
  }
  
  return saveData;
};

export default resetPasswordUserService;
