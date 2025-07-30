import redisClient from "../../../config/redis/redis.js";
import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import updateSessionUserRepository from "../../../repository/auth/user/update_session_user_repository.js";
import AppError from "../../../utils/appError.js";

const logoutSessionUserService = async (id_user) => {
  const findUser = {
    user_id:id_user
  }
  const sessionUser = await findSessionUserRepository(findUser);
  if (!sessionUser) {
    throw new AppError("You're not logged in.", 401);
  }
  const accessToken = sessionUser.access_token;
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

  if (updateSession && insertBlacklistAccessToken === "OK") {
    return {
      statusCode: 200,
      message: "Logout successful. Access token has been blacklisted.",
    };
  } else {
    throw new AppError("Logout failed due to a server error.", 500);
  }
};
export default logoutSessionUserService;
