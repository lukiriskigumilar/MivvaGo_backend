import fs from 'fs';
import path from 'path';

import AppError from '../../appError.js';

const getTemplateEmailVerification = (name, verificationLink) => {
    const filePath = path.join('src', 'utils', 'email_template', 'user', 'email_verfication.html');

    try {
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        return htmlContent
            .replace(/{{name}}/g, name)
            .replace(/{{verificationLink}}/g, verificationLink)
    } catch (error) {
        throw new AppError('Failed to read email template', 500);
    }
}

export default getTemplateEmailVerification;