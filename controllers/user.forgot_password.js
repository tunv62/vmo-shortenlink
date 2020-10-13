const account = require('../models/account')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

module.exports = (req, res) => {
    createToken()
        .then(token => { return searchEmail(req.body.email, token) })
        .then(result => { return sendMailer(result) })
        .catch(err => { 
            req.flash('success', 'an email has been sent to your email')
            res.json({ messages: err, success: false }) 
        })
    function createToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(20, (err, buf) => {
                if (err) return reject(false)
                let token = buf.toString('hex')
                if (token) return resolve(token)
                else return reject(false)
            })
        })
    }
    function searchEmail(email, token) {
        return new Promise((resolve, reject) => {
            account.findOne({ 'local.email': email }, (err, acc) => {
                if (err) return reject(false)
                if (!acc) return reject(false)
                if (acc.local.is_block === true || acc.local.is_active === false)
                    return reject(false)
                acc.local.token = token
                acc.local.expire = Date.now() + (5 * 60 * 1000)
                acc.save((err) => {
                    if (err) return reject(false)
                    else return resolve([token, acc.local.email])
                })
            })
        })
    }
    function sendMailer(result) {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({ // config mail server
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_SEND,
                    pass: process.env.EMAIL_PASSWORD_SEND
                },
                tls: { rejectUnauthorized: false }
            });
            var content = '';
            content += `
                <div style="padding: 10px; background-color: #003375">
                    <div style="padding: 10px; background-color: white;">
                        <h4 style="color: #0085ff">verification link to reset password</h4>
                        <span style="color: black">`+ process.env.nameDomain +`reset/`+ result[0] + `</span> <hr>
                        <span style="color: black">expire: 5 minutes</span>
                    </div>
                </div>`
            var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: 'shortenLink',
                to: result[1],
                subject: 'shortenLink: reset password',
                html: content //Nội dung html 
            }
            transporter.sendMail(mainOptions, (err) => {
                if (err) return reject(false)
                req.flash('success', 'an email has been sent to your email')
                res.json({ messages: 'done', success: true })
                return resolve('done')
            })
        })
    }
}