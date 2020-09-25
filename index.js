require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const favicon = require('serve-favicon')

const validate = require('./config/validator')
require('./config/passport')
const signupController = require('./controllers/guest.signup')
const signupConfirmRegisterController = require('./controllers/guest.signup_confirm_register')
const signupErrorValidateController = require('./controllers/guest.signup_error_validate')
const signupPostSaveController = require('./controllers/guest.signup_post_save')
const configSignupMailer = require('./controllers/guest.mailer_config_signup')
const confirmRegisterController = require('./controllers/guest.confirm_register')
const confirmErrorValidate = require('./controllers/guest.confirm_error_validate')
const loginErrorValidateController = require('./controllers/user.login_error_validate')
const loginController = require('./controllers/user.login')
const loginPassportRedirectOption = require('./controllers/user.login_passport_redirect_option')
const googleCallbackPassportRedirectOption = 
        require('./controllers/user.google_callback_passport_redirect_option')
const resetPasswordController = require('./controllers/user.reset_password')
const resetErrorValidateController = require('./controllers/user.reset_error_validate')
const forgotPasswordController = require('./controllers/user.forgot_password')
const forgotErrorValidateController = require('./controllers/user.forgot_error')
const checkParamsResetPasswordController = require('./controllers/user.check_params_reset_password')
const resetPageController = require('./controllers/user.reset_page')

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

app.listen(4000, () => { console.log('server listening on port 4000') })

app.get('/', (req, res) => { res.render('home') })

app.get('/signup', signupController)

app.post('/signup', 
            validate.validateRegisterAccount(), signupErrorValidateController,
            signupPostSaveController, configSignupMailer)

app.get('/signup/confirm-register', signupConfirmRegisterController)

app.post('/signup/confirm-register', validate.validateConfirmRegister(), 
            confirmErrorValidate, confirmRegisterController)

app.get('/login', loginController)

app.post('/login', validate.validateLogin(), loginErrorValidateController,
            loginPassportRedirectOption)

app.get('/auth/google', 
        passport.authenticate('google.login', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback', googleCallbackPassportRedirectOption)

app.get('/logged', (req, res) => { res.send(req.user) })

app.get('/login/forgot-password', (req, res) => { res.render('forgot_password') })

app.post('/login/forgot-password', validate.validateForgotPassword(), 
            forgotErrorValidateController, forgotPasswordController)

app.get('/reset/:token', checkParamsResetPasswordController, resetPageController)

app.post('/reset/:token', checkParamsResetPasswordController, validate.validateResetPassword(), 
            resetErrorValidateController, resetPasswordController)

app.get('/page-not-found', (req, res) => { res.render('page_not_found') })