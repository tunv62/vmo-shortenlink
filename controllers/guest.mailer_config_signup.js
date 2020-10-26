// const nodemailer = require('nodemailer')
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
    console.log('check ---')
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
        let options = {
            priority: 1
        }
        console.log('check--'+code)
        sendMailQueue.add(data, options)
        req.flash('info', req.body.email)
        res.redirect('/signup/confirm-register')
    })
}

// module.exports = (req, res) => {
//     var transporter = nodemailer.createTransport({ // config mail server
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: process.env.EMAIL_SEND, //Tài khoản gmail vừa tạo
//             pass: process.env.EMAIL_PASSWORD_SEND //Mật khẩu tài khoản gmail vừa tạo
//         },
//         tls: { rejectUnauthorized: false }
//     })
//     var content = ''
//     const code = makeid(6)
//     content += `
//         <div style="padding: 10px; background-color: #003375">
//             <div style="padding: 10px; background-color: white;">
//                 <h4 style="color: #0085ff">verification code to register account</h4>
//                 <span style="color: black">code: `+ code + `</span> <hr>
//                 <span style="color: black">expire: 5 minutes</span>
//             </div>
//         </div>
//     `
//     var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//         from: 'shortenLink',
//         to: req.body.email,
//         subject: 'shortenLink: signup account',
//         html: content //Nội dung html mình đã tạo trên kia :))
//     }
//     let filter = { 'local.email': req.body.email }
//     let update = {
//         'local.token': code,
//         'local.expire': Date.now() + (5 * 60 * 1000)
//     }
//     account.findOneAndUpdate(filter, update, (err, doc) => {
//         if (err) {
//             req.flash('error', 'email is exist or try again')
//             return res.redirect('/signup')
//         }
//         if (doc) {
//             transporter.sendMail(mainOptions, function (err, info) {
//                 if (err) {
//                     req.flash('error', 'email is exist or try again')
//                     return res.redirect('/signup')
//                 } else {
//                     req.flash('info', req.body.email)
//                     res.redirect('/signup/confirm-register')
//                 }
//             })
//         }
//     })
// }