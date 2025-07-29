import prisma from "../../../config/prisma/client.js";


const registerUserRepository = async (data) => (await prisma.users.create({data}));

export default registerUserRepository;