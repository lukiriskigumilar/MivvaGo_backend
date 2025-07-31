import redisClient from "../../../config/redis/redis.js";
import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import updateSessionUserRepository from "../../../repository/auth/user/update_session_user_repository.js";
import AppError from "../../../utils/appError.js";
import { createCookieString } from "../../../utils/cookie_helper.js";

const logoutSessionUserService = async (accessToken, id_session, id_user) => {
   let sessionUser;

  if (!accessToken && id_session) {
    const whereClause = {
      id:id_session, 
      user_id:id_user
    }
    sessionUser = await findSessionUserRepository(whereClause);
    if (!sessionUser) throw new AppError("Session not found", 404);
    accessToken = sessionUser.access_token;
  } else if (accessToken) {
    sessionUser = await findSessionUserRepository({ access_token: accessToken });
    if (!sessionUser) throw new AppError("You're not logged in.", 401);
  } else {
    throw new AppError("Access token or session ID required", 400);
  }
  const dataToUpdate = {
    is_revoked: true,
    refresh_token_expiry: new Date(),
  };
  const updateSession = await updateSessionUserRepository(
    sessionUser.id,
    dataToUpdate
  );
  const ttlInSecond = 25 * 60 * 60;
  const insertBlacklistAccessToken = await redisClient.set(
    `blacklist_access_token:${accessToken}`,
    "1",
    "EX",
    ttlInSecond
  );

  const deletedAccessToken = createCookieString("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });
  const deletedRefreshToken = createCookieString("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  if (updateSession && insertBlacklistAccessToken === "OK") {
    return {
      deletedAccessToken,
      deletedRefreshToken,
      statusCode: 200,
      message: "Logout successful. Access token has been blacklisted.",
    };
  } else {
    throw new AppError("Logout failed due to a server error.", 500);
  }
};
export default logoutSessionUserService;
