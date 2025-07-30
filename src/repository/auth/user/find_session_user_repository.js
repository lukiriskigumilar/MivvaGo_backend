import prisma from "../../../config/prisma/client.js";


const findSessionUserRepository = async (WhereClause) => {
    return await prisma.user_session.findFirst({
        where: WhereClause
    })
} 

export default findSessionUserRepository; 