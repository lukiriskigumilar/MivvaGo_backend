import prisma from "../../../models/prisma/client.js"


const userSessionRepository = async (data,) => {
    return prisma.user_session.create({
        data:data,

    })
}
export default userSessionRepository