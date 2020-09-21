const { body } = require('express-validator')

const validateRegisterAccount = ()=>{
    return [
        body('firstname', 'firstname is required').notEmpty(),
        body('lastname', 'lastname is required').notEmpty(),
        body('email', 'email is required').notEmpty(),
        body('email', 'email invalid').isEmail(),
        body('password', 'password than 3 char').isLength({ min: 3})
    ]
}

let validate = {
    validateRegisterAccount: validateRegisterAccount
}

module.exports = validate