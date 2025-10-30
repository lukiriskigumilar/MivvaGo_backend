
import findUser from "../../../repository/auth/user/find_user_repository.js";
import AppError from "../../../utils/appError.js";

const detailUserService =  async (id) => {
    const WhereClause = {
        id:id
    }
    const user = await findUser(WhereClause);
    if (!user){
     throw new AppError('User not found', 404);
    }
   const { id:___, is_user, is_verified, verification_token, password, created_at, updated_at, deleted_at, ...userDetail } = user;
    return userDetail
}
export default detailUserService;