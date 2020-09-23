require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const favicon = require('serve-favicon')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const account = require('./models/account')
const validate = require('./config/validator')
require('./config/passport')
const signupErrorValidateController = require('./controllers/guest.signup_error_validate')
const signupPostSaveController = require('./controllers/guest.signup_post_save')
const configSignupMailer = require('./controllers/guest.mailer_config_signup')
const confirmRegisterController = require('./controllers/guest.confirm_register')
const loginErrorValidateController = require('./controllers/user.login_error_validate')

const app = express()

mongoose.connect('mongodb://localhost/vmo_shortenlink', { useNewUrlParser: true })

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/img/bg-showcase-2.jpg'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'key',
    cookie: {
        maxAge: 5 * 60 * 1000
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.listen(4000, () => {
    console.log('server listening on port 4000')
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/signup', (req, res) => {
    let messages = req.flash('error')
    res.render('signup', {
        messages: messages
    })
})

app.post('/signup', validate.validateRegisterAccount(), signupErrorValidateController,
    signupPostSaveController, configSignupMailer)

app.get('/signup/confirm-register', (req, res) => {
    let email = req.flash('info')
    res.render('confirm_register', { email: email })
})

app.post('/signup/confirm-register', confirmRegisterController)

app.get('/login', (req, res) => {
    let error = req.flash('error')
    if (error.length > 0) res.render('login', { messages: error, type: false })
    else {
        let success = req.flash('success')
        res.render('login', { messages: success, type: true })
    }
})

app.post('/login', validate.validateLogin(), loginErrorValidateController,
    passport.authenticate('local.login', {
        successRedirect: '/logged',
        failureRedirect: '/login',
        failureFlash: true
    })
)

app.get('/auth/google', passport.authenticate('google.login', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback', passport.authenticate('google.login', {
    successRedirect: '/logged',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/logged', (req, res) => {
    res.send(req.user)
})

app.get('/login/forgot-password', (req, res) => {
    res.render('forgot_password')
})

app.post('/login/forgot-password', (req, res) => {
    createToken()
        .then(token => { return searchEmail(req.body.email, token) })
        .then(result => { return sendMailer(result) })
        .catch(err => { res.json({ messages: err, success: false }) })
    function createToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(20, (err, buf) => {
                if (err) reject('promise is rejected')
                else {
                    let token = buf.toString('hex')
                    if (token) resolve(token)
                    else reject('promise is rejected, token is emty')
                }
            })
        })
    }
    function searchEmail(email, token) {
        return new Promise((resolve, reject) => {
            account.findOne({ 'local.email': email }, (err, acc) => {
                if (err) reject('wrong error')
                if (!acc) reject('email wrong')
                else {
                    acc.local.token = token
                    acc.local.expire = Date.now() + (5 * 60 * 1000)
                    acc.save((err) => {
                        if (err) reject('wrong error')
                        else resolve([token, acc.local.email])
                    })
                }
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
                        <h4 style="color: #0085ff">verification code to reset password</h4>
                        <span style="color: black">http://localhost:4000/reset/`+ result[0] + `</span> <hr>
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
                if (err) reject('wrong error')
                req.flash('success', 'an email has been sent to ' + result[1])
                res.json({ messages: 'done', success: true })
                resolve('done')
            })
        })
    }
})

app.get('/reset/:token', (req, res) => {
    account.findOne({ 'local.token': req.params.token }, (err, acc) => {
        if (err) return res.redirect('/page-not-found')
        if (!acc) return res.redirect('/page-not-found')
        res.render('reset_password')
    })
})

app.post('/reset/:token', (req, res) => {
    checkToken()
        .then(email => { return sendMailer(email) })
        .catch(err => { res.json({ messages: err, success: false }) })
    function checkToken() {
        return new Promise((resolve, reject) => {
            account.findOne({ 'local.token': req.params.token }, (err, acc) => {
                if (err) reject('Password reset token is invalid or has expired.')
                if (!acc) reject('Password reset token is invalid or has expired.')
                if (acc.local.expire < Date.now()) reject('Password reset token is invalid or has expired.')
                acc.local.password = req.body.password
                acc.local.token = undefined
                acc.local.expire = undefined
                acc.save(err => {
                    if (err) reject('wrong error')
                    else resolve(acc.local.email)
                })
            })
        })
    }
    function sendMailer(email) {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({ // config mail server
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_SEND,
                    pass: process.env.EMAIL_PASSWORD_SEND
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });
            var content = '';
            content += `
                <div style="padding: 10px; background-color: #003375">
                    <div style="padding: 10px; background-color: white;">
                        <h4 style="color: #0085ff">successfully</h4>
                        <span style="color: black">the password for your account `+ email + ` has just been changed.</span> <hr>
                        <span style="color: black">expire: 5 minutes</span>
                    </div>
                </div>
            `;
            var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: 'shortenLink',
                to: email,
                subject: 'shortenLink: reset password success',
                html: content //Nội dung html 
            }
            transporter.sendMail(mainOptions, (err) => {
                if (err) reject('wrong error')
                req.flash('success', 'Your password has been changed.')
                res.json({ messages: 'done', success: true })
                resolve('done')
            })
        })
    }
})

// app.get('/test', (req, res) => {
//     res.render('reset_password', {
//         messages: 'ok'
//     })
// })

app.get('/page-not-found', (req, res) => {
    res.render('page_not_found')
})