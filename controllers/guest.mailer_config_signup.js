const account = require('../models/account')
const { sendMailQueue } = require('../config/mailer_job_queue')

function makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

module.exports = (req, res) => {
    let code = makeid(6)
    let filter = { 'local.email': req.body.email }
    let update = {
        'local.token': code,
        'local.expire': Date.now() + (5 * 60 * 1000)
    }
    account.findOneAndUpdate(filter, update, (err, acc) => {
        if (err || !acc) {
            req.flash('error', 'email existed or try again')
            return res.redirect('/signup')
        }
        let data = {
            email: req.body.email,
            code: code,
            opt: '1'
        }
        let options = { priority: 1 }
        sendMailQueue.add(data, options)
        req.flash('info', req.body.email)
        res.redirect('/signup/confirm-register')
    })
}