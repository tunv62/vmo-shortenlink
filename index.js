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