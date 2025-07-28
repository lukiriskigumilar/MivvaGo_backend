
import { successResponse,errorResponse } from "../../../utils/custome_response.js";
import loginUserService from "../../../services/auth/user/login_service.js";

const loginController = async (req, res) => {
    
    try {
        const userData = req.body
        const userAgent = req.useragent
        const ipAddress = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        const result = await loginUserService(userData,userAgent,ipAddress);
        if(result){
            res.setHeader(
                "set-Cookie", [
                    result.refreshTokenCookie,
                    result.accessTokenCookie,
                ]
            )
            successResponse(res, 'Login successfully', null, 200)
        }
        
        
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
    }
}

export default loginController;