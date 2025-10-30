import sendForgetPasswordMailService from "../../../services/auth/user/send_forget_password_mail_service.js";
import { successResponse, errorResponse } from "../../../utils/custom_response.js";

const sendForgetPasswordMailController = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await sendForgetPasswordMailService(email);
    successResponse(res, response.message, {}, 200);
  } catch (error) {
   errorResponse(res, error.message || 'Internal Server Error', { error: error.message }, error.statusCode || 500);
  }
}

export default sendForgetPasswordMailController;
