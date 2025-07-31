import logoutSessionUserService from "../../../services/auth/user/logout_service.js"
import { errorResponse, successResponse } from "../../../utils/custom_response.js"

const logoutUserSessionByIdController = async (req,res) =>{
    const id_session = req.params.id
    const id_user = req.user.id
    try {
        const result = await logoutSessionUserService(null,id_session,id_user); 
        successResponse(res,"Session account logout successfully",{},200)
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
    }
}

export default logoutUserSessionByIdController;