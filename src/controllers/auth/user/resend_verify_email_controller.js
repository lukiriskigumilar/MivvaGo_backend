import { successResponse, errorResponse } from "../../../utils/custome_response.js";
import sendVerifyEmail from "../../../services/auth/user/send_verify_email.js";

const resendVerifyEmailController = async (req, res) => {
    const {email} = req.body;
    try {
        const emailSent = await sendVerifyEmail(email);
        if (emailSent.success) {
            return successResponse(res, 'Verification email resent successfully', {}, 200);
        }
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);    
    }

}
export default resendVerifyEmailController;