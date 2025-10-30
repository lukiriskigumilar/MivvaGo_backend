import detailUserService from "../../../services/auth/user/detail_user_service.js";
import { errorResponse,successResponse } from "../../../utils/custom_response.js";


const detailUserController = async (req,res) =>{
    const id = req.user.id; 
    try {
        const detailUser = await detailUserService(id); 
        successResponse(res,"Retrieve data successfully",{detailUser}, 200)
    } catch (error) {
        errorResponse(res, error.message||"Internal server Error",{error:error.message}, error.statusCode || 500)
    }
} 

export default detailUserController;

