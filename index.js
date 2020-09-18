const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

mongoose.connect('mongodb://localhost/vmo_shortenlink', {useNewUrlParser: true})

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(4000, ()=>{
    console.log('server listening on port 4000')
})

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/signup', (req, res)=>{
    console.log('show ok')
    res.render('signup')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/signup/confirm-register', (req, res)=>{
    res.render('confirm_register')
})

app.get('/login/forgot-password', (req, res)=>{
    res.render('forgot_password')
})