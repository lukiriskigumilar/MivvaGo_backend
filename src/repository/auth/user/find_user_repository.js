import prisma from "../../../models/prisma/client.js";

const findUser = async (WhereClause) => {
    return await prisma.users.findFirst({
        where: WhereClause
    });
}

export default findUser;