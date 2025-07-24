import prisma from "../../../models/prisma/client.js";


const registerUserRepository = async (data) => (await prisma.users.create({data}));

export default registerUserRepository;