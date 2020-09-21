require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
// const passport = require('passport')

const account = require('./models/account')
const validate = require('./controllers/validator')
const signupErrorValidateController = require('./controllers/guest.signup_error_validate')
const signupPostSaveController = require('./controllers/guest.signup_post_save')
const configSignupMailer = require('./controllers/guest.config_signup_mailer')

const app = express()

mongoose.connect('mongodb://localhost/vmo_shortenlink', {useNewUrlParser: true})

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'key'
}))
app.use(flash())
// app.use(passport.initialize())
// app.use(passport.session)

app.listen(4000, ()=>{
    console.log('server listening on port 4000')
})

app.get('/', (req, res)=>{
    req.flash('error', 'check set flash ok')
    res.render('home')
})

app.get('/signup', (req, res)=>{
    console.log('show ok')
    let messages = req.flash('error')
    res.render('signup', {
        messages: messages
    })
})

app.post('/signup', validate.validateRegisterAccount(), signupErrorValidateController, signupPostSaveController, configSignupMailer)

// app.post('/signup', validate.validateRegisterAccount(), signupErrorValidateController, (req, res)=>{
//     let check = req.body.email
//     console.log(check)
//     res.redirect('/')
// })

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/signup/confirm-register', (req, res)=>{
    let email = req.flash('success')
    console.log(email)
    res.render('confirm_register', {
        email: email
    })
})

app.post('/signup/confirm-register', (req, res)=>{
    let { email, code } = req.body
    if ( !email || !code){
        res.status(200).json({ messages: 'you have to input value', success: false })
    }else{
        account.findOne({'local.email': email}, (err, acc)=>{
            if(err) res.json({ messages: 'not find', success: false})
            if (!acc) res.json({ messages: 'email not found', success: false})
            else {
                if(acc.local.is_active === true || acc.local.expire < Date.now())
                    res.json({messages: 'wrong, code was expired', success: false})
                else {
                    if(acc.local.token === code){
                        acc.local.is_active = true
                        acc.save((err)=>{
                            if(err) res.json({ messages: 'not save', success: false})
                            else res.json({messages: 'success', success:true})
                        })
                    } 
                    else res.json({messages: 'wrong, code not matching', success: false })
                }
            }
        })
    }
})

app.get('/login/forgot-password', (req, res)=>{
    res.render('forgot_password')
})