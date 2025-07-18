import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import appError from '../../../utils/appError.js';
import findUniqueUser from '../../../repository/auth/user/find_user_repository.js';
import createUser from '../../../repository/auth/user/register_repository.js';
import findUser from '../../../repository/auth/user/find_user_repository.js';


const regiserUserService = async (data) => {
    const id = uuidv4();
    const {
        name,
        email,
        phone_number,
        password
    } = data;
    const hashedPassword = await bcrypt.hash(password, 15);
    const is_verified = false;
    const verification_token = uuidv4();
    const created_at = new Date();
    const whereClause = {
        OR: [
            { email: email },
            { phone_number: phone_number }
        ]
    }

    const exsitingUser = await findUser(whereClause);
    if (exsitingUser) {
        const conflictFields = exsitingUser.email === email ? 'email' : 'phone number';
        throw new appError(`User with this ${conflictFields} already exists`, 409);
    }

    const saveData = {
        id,
        name,
        email,
        phone_number,
        password: hashedPassword,
        is_verified,
        verification_token,
        created_at
    }
    const user = await createUser(saveData);
    if (!user) {
        throw new appError('Failed to create user', 500);
    }

    //Todo: send verification email
    // const emailSent = await sendVerifyemail(user.id, verification_token);
    // if (!emailSent) {
    //     throw new appError('Failed to send verification email', 500);
    // }

    const { id: _id, is_user: _is_user, is_verified: _is_verfied, verification_token: _verfication_token, password: _ps,
        created_at:_, updated_at:__, deleted_at:___ , ...throwData } = user;
    return throwData;



}

export default regiserUserService;