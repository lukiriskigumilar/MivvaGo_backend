import getManageUserSessionService from "../../../services/auth/user/manage_user_session_service.js";
import { errorResponse,successResponse } from "../../../utils/custom_response.js";
const manageUserSessionController = async(req,res) => {
    const id_user = req.user.id
    const token = req.accessToken
    try {
        const result = await getManageUserSessionService(id_user,token); 
        successResponse(res,"retrieve data successfully",result.mappedSessions,200)    
    } catch (error) {
           errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
    }
}

export default manageUserSessionController;