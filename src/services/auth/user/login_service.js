import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

import { createCookieString } from "../../../utils/cookie_helper.js";
import AppError from "../../../utils/appError.js";
import findUser from "../../../repository/auth/user/find_user_repository.js";
import userSessionRepository from "../../../repository/auth/user/user_session_repository.js";

const loginUserService = async (userData, useragent, ipAddress) => {
  const { email, password } = userData;
  const ua = useragent;
  const searchQuery = { email: email.toLowerCase() };
  const user = await findUser(searchQuery);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const password_valid = await bcrypt.compare(password, user.password);
  if (!password_valid) {
    throw new AppError("Incorrect password", 401);
  }
  if (user.is_verified === false) {
    throw new AppError("User is not verified please verfied your account", 403);
  }
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
  const id = uuidv4();
  const now = new Date();
  const refresh_token = uuidv4();
  const refresh_token_expiry = new Date(
    now.getTime() + 20 * 24 * 60 * 60 * 1000
  );
  const device = ua.isMobile
    ? "Mobile"
    : ua.isTablet
    ? "Tablet"
    : ua.isDesktop
    ? "Desktop"
    : "unknown";
  const user_agent = {
    browser: ua.browser,
    version: ua.version,
    os: ua.os,
    source: ua.source,
  };
  const ip_address = ipAddress;

  const data = {
    id,
    access_token: accessToken,
    refresh_token,
    refresh_token_expiry,
    device,
    ip_address,
    user_agent,
    created_at:now,
    users: {
      connect: {
        id: user.id,
      },
    },
  };
  

  const saveSession = await userSessionRepository(data);
  if (!saveSession) {
    throw new AppError("login failed", 500);
  }

  const refreshTokenCookie = createCookieString("refreshToken", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 20 * 24 * 60 * 60 * 1000,
    path: "/",
    sameSite: "strict",
  });

  const accessTokenCookie = createCookieString("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day
    path: "/",
    sameSite: "strict",
  });

  return {
    accessTokenCookie,
    refreshTokenCookie,
  };
};

export default loginUserService;
