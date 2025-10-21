
import confirmForgetPasswordService from "../../../services/auth/user/confirm_forget_password_service.js"
import { successResponse,errorResponse } from "../../../utils/custom_response.js";

const confirmForgetPasswordController = async (req,res) => {
    const reqData = req.body; 
    
    try {
        const processRes = await confirmForgetPasswordService(reqData);
        if(processRes.success){
          return  successResponse(res,"Password change successfully",{}, 200)
        }
        return errorResponse(
            res, processRes.message || "Failed to change password",{},400
        )
        
    } catch (error) {
      return  errorResponse(res, error.message||"Internal server Error",{error:error.message}, error.statusCode || 500)
    }

}

export default confirmForgetPasswordController;