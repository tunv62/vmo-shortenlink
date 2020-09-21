const { validationResult } = require('express-validator')

module.exports = (req, res, next)=>{
    let { errors } = validationResult(req)
    if( errors.length > 0){
        let messages = []
        for ( let data of errors){
            messages.push(data.msg)
        }
        res.render('login', { messages: messages })
    }else next()

}