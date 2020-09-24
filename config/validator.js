const { body } = require('express-validator')

const validateRegisterAccount = ()=>{
    return [
        body('firstname', 'from 3-20 char (just use char, number, .)').matches(/^[a-zA-Z0-9\s\.]{3,20}$/, "i"),
        body('lastname', 'from 3-20 char (just use char, number, .)').matches(/^[a-zA-Z0-9\s\.]{3,20}$/, "i"),
        body('email', 'email invalid').isEmail(),
        body('password', 'password 3-10 char').isLength({ min: 3, max: 10}),
        body('password', 'password least 1 character and 1 number').matches(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/, "i")
    ]
}

const validateConfirmRegister = () => {
    return [
        body('email', 'code not matching').isEmail(),
        body('code', 'code not matching').matches(/^[a-zA-Z0-9]{6}$/, "i")
    ]
}

const validateLogin = () => {
    return [
        body('email', 'email invalid').isEmail(),
        body('password', 'password 3-10 character').isLength({ min: 3, max:10}),
        body('password', 'password incorrect format').matches(/^[a-zA-Z0-9]{3,10}$/, "i")
    ]
}

const validateResetPassword = ()=>{
    return [
        body('password', 'password 3-10 character').isLength({ min: 3, max:10}),
        body('password', 'password least 1 character and 1 number').matches(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/, "i")
    ]
}

const validateForgotPassword = ()=>{
    return [
        body('email', 'email invalid').isEmail()
    ]
}

let validate = {
    validateRegisterAccount: validateRegisterAccount,
    validateLogin: validateLogin,
    validateForgotPassword: validateForgotPassword,
    validateResetPassword: validateResetPassword,
    validateConfirmRegister: validateConfirmRegister
}

module.exports = validate