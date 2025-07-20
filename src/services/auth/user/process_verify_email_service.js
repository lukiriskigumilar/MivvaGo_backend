
import findUser from "../../../repository/auth/user/find_user_repository.js";
import AppError from '../../../utils/appError.js';
import updateUser from "../../../repository/auth/user/update_user_repository.js";

const processVerifyEmailService = async (token) => {
    if (!token) {
        throw new AppError('Verification token is required', 400);
    }
    const whereClause = {
        verification_token: token
    }
    const user = await findUser(whereClause);
    if (!user) {
        throw new AppError('Token vailed user not found', 404);
    }
    if (user.is_verified) {
        throw new AppError('User is already verified', 400);
    }
    const updateData = {
        is_verified: true,
        updated_at: new Date()
    }
    // Update user verification status
    await updateUser(user.id, updateData);
    return {
        success: true,
        message: 'User verified successfully',
    };

}

export default processVerifyEmailService;