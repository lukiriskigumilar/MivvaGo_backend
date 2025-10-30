
import registerUserService from "../../../services/auth/user/register_service.js";
import {successResponse, errorResponse} from '../../../utils/custom_response.js';

const registerUserController = async (req,res) =>{
    const data = req.body;
    try {
    const user = await registerUserService(data);
    successResponse(res, 'User registered successfully', user, 201);

        
    } catch (error) {
        if (error.statusCode) {
            errorResponse(res, error.message, {}, error.statusCode);
        } else {
            errorResponse(res, 'Internal Server Error', {error: error.message}, 500);
        }
    }
}


export default registerUserController;