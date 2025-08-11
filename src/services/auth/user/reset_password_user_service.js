import bcrypt from 'bcrypt';
import dotenv from "dotenv"; 
dotenv.config()

import AppError from '../../../utils/appError.js';
import findUser from '../../../repository/auth/user/find_user_repository.js';
import updateUserRepository from '../../../repository/auth/user/update_user_repository.js';
const resetPasswordUserService =  async (userId, data) => {
   const {
    old_password:oldPassword, 
    new_password:newPassword,
   } = data;

   const user = await findUser({ id: userId });
   if (!user) {
       throw new AppError("User not found", 404)
   }
   const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
   if(!isPasswordValid){
      throw new AppError("Old Password not valid", 401)
   }
   const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
   const dataToUpdate = {
    password:hashedPassword
   }
   const saveData = await updateUserRepository(userId,dataToUpdate)
   return saveData

}

export default resetPasswordUserService;