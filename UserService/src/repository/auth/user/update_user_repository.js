
import prisma from "../../../config/prisma/client.js";

const updateUserRepository = async (id, dataToUpdate) => {
    return  prisma.users.update({
        where: {
            id: id,
        },
        data: dataToUpdate,
    })
}


export default updateUserRepository;