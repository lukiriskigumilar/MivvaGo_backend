import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import authValidator from "../user/user_validator.js";
import { errorResponse } from "../../../utils/custom_response.js";
import redisClient from "../../../config/redis/redis.js";
import AppError from "../../../utils/appError.js";
import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import cookieParser from "cookie-parser";

const validateUserRegistration = (req, res, next) => {
  const { error } = authValidator.registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return errorResponse(
      res,
      "Validation Fields Error",
      { error_fields: errorMessages },
      400
    );
  }
  next();
};

const validateResendVerifyEmail = (req, res, next) => {
  const { error } = authValidator.resendVerifyEmailSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return errorResponse(
      res,
      "Validation Fields Error",
      { error_fields: errorMessages },
      400
    );
  }
  next();
};

const validateLoginEmail = (req, res, next) => {
  const { error } = authValidator.loginVerifySchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return errorResponse(
      res,
      "Validation Fields Error",
      { error_fields: errorMessages },
      400
    );
  }
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        return errorResponse(
          res,
          "You're already logged in",
          { error: "You're already logged in" },
          409
        );
      }
      next();
    });
  } else {
    next();
  }
};

const validateGetAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return errorResponse(
      res,
      "refresh token invalid",
      { refresh_token: "Refresh token is required" },
      401
    );
  }
  req.refreshToken = refreshToken;
  next();
};

const validateCredentialUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return errorResponse(
      res,
      "AccessToken is Required",
      { error: "Missing accessToken" },
      401
    );
  }
  try {
    const decode = await jwt.verify(accessToken, process.env.JWT_SECRET);
    const isBlackListed = await redisClient.get(
      `blacklist_access_token:${accessToken}`
    );
    if (isBlackListed) {
      return errorResponse(
        res,
        "Token has been blacklisted",
        { error: "blacklisted_token" },
        401
      );
    }
    req.user = decode;
    req.accessToken = accessToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      errorResponse(res, "Token expired", { error: "Token expired" }, 401);
    } else {
      errorResponse(res, "Invalid Token", { error: "Invalid_token" }, 401);
    }
  }
};

const validateLogoutUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return errorResponse(
      res,
      "missing access Token",
      { error: "Access token cookies can not found" },
      401
    );
  }
  await jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return errorResponse(
        res,
        "not Valid Credential",
        { error: "You're access Token not valid" },
        401
      );
    }
    req.accessToken = accessToken
    next();
  });
};

export default {
  validateUserRegistration,
  validateResendVerifyEmail,
  validateLoginEmail,
  validateCredentialUser,
  validateGetAccessToken,
  validateLogoutUser,
};
