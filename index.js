require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const favicon = require('serve-favicon')

const account = require('./models/account')
const validate = require('./config/validator')
require('./config/passport')
const signupErrorValidateController = require('./controllers/guest.signup_error_validate')
const signupPostSaveController = require('./controllers/guest.signup_post_save')
const configSignupMailer = require('./controllers/guest.config_signup_mailer')
const confirmRegisterController = require('./controllers/guest.confirm_register')
const loginErrorValidateController = require('./controllers/user.login_error_validate')

const app = express()

mongoose.connect('mongodb://localhost/vmo_shortenlink', {useNewUrlParser: true})

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/img/bg-showcase-2.jpg'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'key',
    cookie: {
        maxAge: 5 * 60 * 1000
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.listen(4000, ()=>{
    console.log('server listening on port 4000')
})

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/signup', (req, res)=>{
    let messages = req.flash('error')
    res.render('signup', {
        messages: messages
    })
})

app.post('/signup', validate.validateRegisterAccount(), signupErrorValidateController, signupPostSaveController, configSignupMailer)

app.get('/signup/confirm-register', (req, res)=>{
    let email = req.flash('success')
    console.log(email)
    res.render('confirm_register', {
        email: email
    })
})

app.post('/signup/confirm-register', confirmRegisterController)

app.get('/login', (req, res)=>{
    let messages = req.flash('error')
    console.log(messages)
    res.render('login', {messages: messages})
})

app.post('/login', validate.validateLogin(), loginErrorValidateController, 
    passport.authenticate('local.login', {
        successRedirect: '/logged',
        failureRedirect: '/login',
        failureFlash: true
    })
)

app.get('/auth/google', passport.authenticate('google.login', { scope: ['profile', 'email']}))

app.get('/auth/google/callback', passport.authenticate('google.login', {
    successRedirect: '/logged',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/logged', (req, res)=>{
    res.send(req.user)
})

app.get('/login/forgot-password', (req, res)=>{
    res.render('forgot_password')
})