
import authValidator from '../user/user_validator.js';
import { errorResponse } from '../../../utils/custome_response.js';

const validateUserRegistration = (req, res, next) => {
    const { error } = authValidator.registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return errorResponse(res, 'Validation Fields Error', { error_fields: errorMessages }, 400);
    }
    next();
}

const validateResendVerifyEmail = (req, res, next) => {
    const { error } = authValidator.resendVerifyEmailSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return errorResponse(res, 'Validation Fields Error', { error_fields: errorMessages }, 400);
    }
    next();
}

export default {
    validateUserRegistration,
    validateResendVerifyEmail,
}