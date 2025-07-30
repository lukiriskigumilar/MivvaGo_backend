import logoutSessionUserService from "../../../services/auth/user/logout_service.js";
import { errorResponse, successResponse } from "../../../utils/custom_response.js";

const logoutUserController = async (req, res) => {
  const accessToken = req.accessToken;
  try {
    const result = await logoutSessionUserService(accessToken);
        res.setHeader("Set-Cookie", [
            result.deletedAccessToken,
            result.deletedRefreshToken,
        ]);
       
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
