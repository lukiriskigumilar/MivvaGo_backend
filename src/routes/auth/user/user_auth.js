import express from "express";

import registerUserController from "../../../controllers/auth/user/register_controller.js";
import resendVerifyEmailController from "../../../controllers/auth/user/resend_verify_email_controller.js";
import processVerifyEmailController from "../../../controllers/auth/user/process_verify_email_controller.js";
import loginController from "../../../controllers/auth/user/login_controller.js";
import detailUserController from "../../../controllers/auth/user/detail_user_controller.js";
import logoutUserController from "../../../controllers/auth/user/logout_user_controller.js";
import manageUserSessionController from "../../../controllers/auth/user/manage_user_session_controller.js";
import logoutUserSessionByIdController from "../../../controllers/auth/user/logout_user_session_byId.js";
import generateUserAccessTokenController from "../../../controllers/auth/user/generate_user_accessToken_cotroller.js";
import resetPasswordUserController from "../../../controllers/auth/user/reset_password_user_controller.js";
import confirmForgetPasswordController from "../../../controllers/auth/user/confirm_forget_password_controller.js";

import authMiddlewareUser from "../../../middlewares/auth/user/user_middleware.js";
import sendForgetPasswordMailController from "../../../controllers/auth/user/send_forget_password_mail_controller.js";
const router = express.Router();

router.post(
  "/register",
  authMiddlewareUser.validateUserRegistration,
  registerUserController
);
router.post(
  "/resend-verify-email",
  authMiddlewareUser.validateResendVerifyEmail,
  resendVerifyEmailController
);
router.get("/verify-email/:token", processVerifyEmailController);
router.post("/login", authMiddlewareUser.validateLoginEmail, loginController);
router.post("/generate-accessToken",authMiddlewareUser.validateGetAccessToken,generateUserAccessTokenController )
router.get(
  "/detail-user",
  authMiddlewareUser.validateCredentialUser,
  detailUserController
);
router.get(
  "/active-session",
  authMiddlewareUser.validateCredentialUser,
  manageUserSessionController
);
router.post(
  "/active-session/logout/:id",
  authMiddlewareUser.validateCredentialUser,
  logoutUserSessionByIdController
);
router.post(
  "/logout",
  authMiddlewareUser.validateLogoutUser,
  logoutUserController
);
router.post(
  "/reset-password",
  authMiddlewareUser.validateChangePassword,
  authMiddlewareUser.validateCredentialUser,
  resetPasswordUserController
);

router.post(
  "/forget-password",
  sendForgetPasswordMailController,
)

router.post(
  "/confirm-forget-password",
  authMiddlewareUser.validateConfirmForgetPassword,
  confirmForgetPasswordController
)

export default router;
