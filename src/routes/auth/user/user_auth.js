import express from 'express';

import registerUserController from '../../../controllers/auth/user/register_controller.js';
import authMiddlewareUser from '../../../middlewares/auth/user/user_middleware.js';

const router = express.Router();

router.post('/register', authMiddlewareUser.validateUserRegistration, registerUserController); 



export default router;