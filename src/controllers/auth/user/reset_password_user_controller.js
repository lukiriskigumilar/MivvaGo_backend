import resetPasswordUserService from "../../../services/auth/user/reset_password_user_service.js";
import { errorResponse,successResponse } from "../../../utils/custom_response.js";
const resetPasswordUserController = async (req,res) =>{
    const userId = req.user.id; 
    const data = req.body; 

    try {
        const result = await resetPasswordUserService(userId,data)
        if(result){
         successResponse(res,"Password change Successfully", null, 200);
        }
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);  
    }

}
export default resetPasswordUserController;