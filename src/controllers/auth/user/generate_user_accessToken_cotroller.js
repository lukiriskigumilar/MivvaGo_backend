import generateUserAccessTokenService from "../../../services/auth/user/generate_user_accessToken_service.js"
import { errorResponse,successResponse } from "../../../utils/custom_response.js";

const generateUserAccessTokenController = async (req,res) => {
    const refreshToken = req.refreshToken; 

    try {
        const result = await generateUserAccessTokenService(refreshToken); 
        if(result){
            res.setHeader("set-Cookie",[
                result.accessTokenCookie
            ])
            successResponse(res,"Get token access successfully", null , 200); 
        }
    } catch (error) {
        errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
    }

}

export default generateUserAccessTokenController;