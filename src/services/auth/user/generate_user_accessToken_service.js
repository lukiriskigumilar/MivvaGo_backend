import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import updateSessionUserRepository from "../../../repository/auth/user/update_session_user_repository.js";
import findUser from "../../../repository/auth/user/find_user_repository.js";
import AppError from "../../../utils/appError.js";
import { createCookieString } from "../../../utils/cookie_helper.js";

const generateUserAccessTokenService = async (refreshToken) => {
  const whereClause = {
    refresh_token: refreshToken,
  };

  const session = await findSessionUserRepository(whereClause);
  if (!session) {
    throw new AppError("refresh token missing", 404);
  }
  if (session.refresh_token_expiry <= Date.now()) {
    throw new AppError("refresh token expiry please re login", 401);
  }
  if (session.is_revoked) {
    throw new AppError("Session has been logout", 401);
  }

  const user = await findUser({ id: session.user_id });

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  const dataToUpdate = {
    access_token: accessToken,
  };
  const sessionDetail = await updateSessionUserRepository(session.id, dataToUpdate);

  const accessTokenCookie = createCookieString("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day
    path: "/",
    sameSite: "strict",
  });

  

  return {
    sessionDetail,
    accessTokenCookie
  }
};

export default generateUserAccessTokenService;
