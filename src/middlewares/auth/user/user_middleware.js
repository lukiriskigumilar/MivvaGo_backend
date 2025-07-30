import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import authValidator from "../user/user_validator.js";
import { errorResponse } from "../../../utils/custom_response.js";
import redisClient from "../../../config/redis/redis.js";
import AppError from "../../../utils/appError.js";


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
        return errorResponse(res, "You're already logged in", {error:"You're already logged in"}, 409);
      }
      next();
    });
  } else {
    next();
  }
};

const validateCredentialUser = async (req, res , next) =>{
  const accessToken = req.cookies.accessToken; 
  if(!accessToken){
    return errorResponse(res,"AccessToken is Required", {error:"Missing accessToken"}, 401)
  }
  try {
    const decode = await jwt.verify(accessToken, process.env.JWT_SECRET); 
    const isBlackListed = await redisClient.slsMember('blacklist_access_token', accessToken);
    if(isBlackListed){
      return errorResponse(res, "Token has been blacklisted", { error: "blacklisted_token" }, 401);
    }
    req.user = decode
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError'){
      errorResponse(res, "Token expired", {error:"Token expired"}, 401)
    }else{
      errorResponse(res, "Invalid Token", {error:"Invalid_token"}, 401)
    }
    
  }

}

export default {
  validateUserRegistration,
  validateResendVerifyEmail,
  validateLoginEmail,
  validateCredentialUser,
};
