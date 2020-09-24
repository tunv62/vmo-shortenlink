const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
    let { errors } = validationResult(req)
    if (errors.length > 0) res.json({ messages: true, success: false })
    else next()
}