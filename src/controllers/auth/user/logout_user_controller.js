import logoutSessionUserService from "../../../services/auth/user/logout_service.js";
import { errorResponse, successResponse } from "../../../utils/custom_response.js";

const logoutUserController = async (req, res) => {
  const id_user = req.user.id;
  try {
    const result = await logoutSessionUserService(id_user);
    successResponse(res, result.message, {}, result.statusCode);
  } catch (error) {
    errorResponse(
      res,
      error.message || "Internal Server Error",
      { error: error.message },
      error.statusCode || 500
    );
  }
};

export default logoutUserController;
