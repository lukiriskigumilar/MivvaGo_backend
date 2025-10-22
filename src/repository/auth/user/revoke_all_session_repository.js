import prisma from "../../../config/prisma/client.js";

const revokeAllSessionRepository = async (userId, dataToUpdate) => {
  return await prisma.user_session.updateMany({
    where: { user_id: userId },
    data: dataToUpdate
  });
};

export default revokeAllSessionRepository;
