import joi from 'joi';

const registerSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).required(),
    password: joi.string().min(8).max(20).required(),
    confirm_password: joi.string().valid(joi.ref('password')).required()
})

const resendVerifyEmailSchema = joi.object({
    email: joi.string().email().required(),
})

export default {
    registerSchema,
    resendVerifyEmailSchema,
}