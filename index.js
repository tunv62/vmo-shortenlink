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
const getShortLinkGuest = require('./controllers/guest.get_short_link')
const accessShortLink = require('./controllers/access_short_link')
const userGetShortLink = require('./controllers/user.get_short_link')
const validateUserGetShortLink = require('./controllers/user.validate_get_short_link')
const isAuthenticatedRedirect = require('./middleware/isAuthenRedirect')
const isAuthenResponseXml = require('./middleware/isAuthenResponseXml')
const accessShortLinkPassword = require('./controllers/access_short_link_password')
const userGetProfile = require('./controllers/user.get_profile')
const getInfoShortlink = require('./controllers/user.get_info_shortlink')
const isAuthenGetShortLink = require('./controllers/user.authen_get_short_link')
const validateUpdateInfoLink = require('./controllers/user.validate_update_info_link')
const updateInfoLink = require('./controllers/user.update_info_link')
const deleteInfoLink = require('./controllers/user.delete_info_link')
const getSatistic = require('./controllers/user.get_statistic')
const validateUpdateProfile = require('./controllers/user.validate_update_profile')
const updateInfoProfile = require('./controllers/user.update_info_profile')
const validateChangePassword = require('./controllers/user.validate_change_password')
const userChangePassword = require('./controllers/user.change_password')
const managerPageGetInfoUser = require('./controllers/user.manager_get_info_user')

const app = express()

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/img/bg-showcase-2.jpg'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 5 * 60 * 1000
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.listen(process.env.PORT || 4000, () => { console.log('server listening on port 4000') })

app.get('/', (req, res) => {
    if (req.user) res.render('home',{logged: true})
    else res.render('home', {logged: false}) 
})

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

app.get('/login/forgot-password', (req, res) => { res.render('forgot_password') })

app.post('/login/forgot-password', validate.validateForgotPassword(), 
            forgotErrorValidateController, forgotPasswordController)

app.get('/reset/:token', checkParamsResetPasswordController, resetPageController)

app.post('/reset/:token', checkParamsResetPasswordController, validate.validateResetPassword(), 
            resetErrorValidateController, resetPasswordController)

app.post('/short-link-guest', getShortLinkGuest)

app.post('/short-link-user', isAuthenGetShortLink, validateUserGetShortLink, userGetShortLink)

app.post('/option-advanced', (req, res)=>{
    if (req.user) res.json({ logged: true })
    else res.json({ logged: false })
})

// app.get('/password-access-link', (req, res)=>{
//     res.render('confirm_password_access_link', { shortUrl: 'wrong'})
// })

app.post('/password-access-link', accessShortLinkPassword)

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
    res.end()
})

app.get('/auth/manager', isAuthenticatedRedirect, managerPageGetInfoUser)

app.get('/auth/profile', isAuthenResponseXml, userGetProfile)

app.post('/auth/profile', isAuthenResponseXml, validateUpdateProfile, updateInfoProfile)

app.post('/auth/change-password', isAuthenResponseXml, validateChangePassword, userChangePassword)

app.get('/auth/user/get-info-shortenlink', isAuthenResponseXml, getInfoShortlink)

app.put('/auth/user/update-info-shortenlink', isAuthenResponseXml, 
        validateUpdateInfoLink, updateInfoLink)

app.delete('/auth/user/delete-info-shortenlink', isAuthenResponseXml, deleteInfoLink)

app.get('/statistic', (req, res)=>{
    res.render('statistic')
})

app.post('/auth/user/statistic', isAuthenResponseXml, getSatistic)

app.get('/page-not-found', (req, res) => { res.render('page_not_found') })

app.get('/:shortenlink', accessShortLink)