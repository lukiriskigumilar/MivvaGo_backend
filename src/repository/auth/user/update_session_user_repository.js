import prisma from "../../../config/prisma/client.js";

const updateSessionUserRepository =  async (id,dataToUpdate) =>{
    return await prisma.user_session.update({
        where: {
            id:id
        }, 
        data:dataToUpdate
    })
} 

export default updateSessionUserRepository;