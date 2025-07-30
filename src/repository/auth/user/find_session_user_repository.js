import prisma from "../../../config/prisma/client.js";

const findSessionUserRepository = async (whereClause, isMany = false) => {
  if (isMany) {
    return await prisma.user_session.findMany({
      where: whereClause,
    });
  } else {
    return await prisma.user_session.findFirst({
      where: whereClause,
    });
  }
};

export default findSessionUserRepository;
