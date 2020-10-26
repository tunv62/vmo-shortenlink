const account = require('../models/account')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

module.exports = (req, res) => {
    hashPass()
        .then(hash => {return checkToken(hash)})
        .then(email => { return sendMailer(email) })
        .catch(err => { res.json({ messages: err, success: false }) })
    function hashPass(){
        return new Promise((resolve, reject)=>{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if (err) return reject(false)
                else resolve(hash)
            })
        })
    }
    function checkToken(hash) {
        return new Promise((resolve, reject) => {
            account.findOne({ 'local.token': req.body.token }, (err, acc) => {
                if (err) return reject(false)
                if (!acc) return reject(false)
                if (acc.local.expire < Date.now() || acc.local.is_block === true ||
                    acc.local.is_active === false) return reject(false)
                acc.local.password = hash
                console.log(acc.local.password)
                acc.local.token = undefined
                acc.local.expire = undefined
                acc.save(err => {
                    if (err) return reject(false)
                    else return resolve(acc.local.email)
                })
            })
        })
    }
    function sendMailer(email) {
        return new Promise((resolve, reject) => {
            req.flash('success', 'Your password has been changed.')
            res.json({ messages: 'done', success: true })
            return resolve('done')
        })
    }
}