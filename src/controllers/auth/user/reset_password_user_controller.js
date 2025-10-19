import resetPasswordUserService from "../../../services/auth/user/reset_password_user_service.js";
import { errorResponse,successResponse } from "../../../utils/custom_response.js";
const resetPasswordUserController = async (req,res) =>{
    const userId = req.user.id; 
    const data = req.body; 

    try {
        const result = await resetPasswordUserService(userId,data)
        if(!result.deletedAccessToken){
         successResponse(res,"Password change Successfully", null, 200);
            return;
        }
        res.setHeader("Set-Cookie", [
          result.deletedAccessToken
        ]);
        successResponse(res, "Password reset successfully, all devices logged out", null, 200);

    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);  
    }

}
export default resetPasswordUserController;