import express from 'express';

import registerUserController from '../../../controllers/auth/user/register_controller.js';
import resendVerifyEmailController from '../../../controllers/auth/user/resend_verify_email_controller.js';
import processVerifyEmailController from '../../../controllers/auth/user/process_verify_email_controller.js';
import loginController from '../../../controllers/auth/user/login_controller.js';
import detailUserController from '../../../controllers/auth/user/detail_user_controller.js';

import authMiddlewareUser from '../../../middlewares/auth/user/user_middleware.js';


const router = express.Router();

router.post('/register', authMiddlewareUser.validateUserRegistration, registerUserController); 
router.post('/resend-verify-email', authMiddlewareUser.validateResendVerifyEmail, resendVerifyEmailController)
router.get('/verify-email/:token', processVerifyEmailController);
router.post('/login',authMiddlewareUser.validateLoginEmail, loginController)
router.get('/detail-user',authMiddlewareUser.validateCredentialUser,detailUserController)

export default router;