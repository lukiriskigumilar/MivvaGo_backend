import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import authValidator from "../user/user_validator.js";
import { errorResponse } from "../../../utils/custome_response.js";


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

export default {
  validateUserRegistration,
  validateResendVerifyEmail,
  validateLoginEmail,
};
