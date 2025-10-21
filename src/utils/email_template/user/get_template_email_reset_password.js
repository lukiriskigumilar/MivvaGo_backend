import fs from 'fs';
import path from 'path';

import AppError from '../../appError.js';

const getTemplateEmailResetPassword = (resetCode) => {
    const filePath = path.join('src', 'utils', 'email_template', 'user', 'Reset_Password.html');
    try {
        const template = fs.readFileSync(filePath, 'utf-8');
        return template.replace('{{resetCode}}', resetCode);
    } catch (error) {
        throw new AppError('Error reading email template', 500);
    }
}

export default getTemplateEmailResetPassword;