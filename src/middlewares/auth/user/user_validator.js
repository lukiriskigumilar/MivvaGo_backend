import joi from 'joi';



const registerSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).required(),
    password: joi.string().min(8).max(20).required(),
    confirm_password: joi.string().valid(joi.ref('password')).required()
})

const resendVerifyEmailSchema = joi.object({
    email: joi.string().email().required()
})

const loginVerifySchema = joi.object(
    {
        email: joi.string().required(),
        password: joi.string().required()
    }
)

const changePasswordSchema = joi.object(
    {
        old_password: joi.string().required(), 
        new_password: joi.string().min(6).required(),
        confirm_password: joi.string().valid(joi.ref('new_password')).required().
        messages({
            'any.only': 'Confirm password must match the new password'
        })

    }
)

export default {
    registerSchema,
    resendVerifyEmailSchema,
    loginVerifySchema,
    changePasswordSchema
}