import findSessionUserRepository from "../../../repository/auth/user/find_session_user_repository.js";
import AppError from "../../../utils/appError.js";

const getManageUserSessionService = async (id_user,accessToken) => {
  const WhereClause = {
    user_id: id_user,
    is_revoked: false,
  };
  const isMany = true
  const findListSession = await findSessionUserRepository(WhereClause,isMany );

  const mappedSessions = findListSession.map((session) => (
    {
    id: session.id,
    device: session.device,
    ip_address: session.ip_address,
    user_agent: {
      os: session.user_agent.os,
      source: session.user_agent.source,
      browser: session.user_agent.browser,
      version: session.user_agent.version,
    },
    this_device:session.access_token === accessToken
  }));
  
  if (!findListSession || findListSession.length === 0) {
    throw new AppError("No active sessions found", 404);
  }
  return {
   mappedSessions
  };
};

export default getManageUserSessionService;