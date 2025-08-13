import fs from 'fs';
import path from 'path';

import AppError from '../../appError.js';
const getTemplateEmailNotifyPasswordChange= () => {
    const filePath = path.join('src', 'utils', 'email_template', 'user', 'notify_password_change.html');
    try {
        const template = fs.readFileSync(filePath, 'utf-8');
        return template;
    } catch (error) {
        throw new AppError('Error sending email template', 500);
    }
}

export default getTemplateEmailNotifyPasswordChange;