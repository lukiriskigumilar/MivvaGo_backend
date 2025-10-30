
import processVerifyEmailService from "../../../services/auth/user/process_verify_email_service.js";
import { successResponse, errorResponse } from '../../../utils/custom_response.js';
const processVerifyEmailController = async (req, res) => {
    const {token} = req.params;
    try {
        const result = await processVerifyEmailService(token);
        if(result.success) {
            return successResponse(res, result.message, {}, 200);
        }
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
        
    }

}
export default processVerifyEmailController;