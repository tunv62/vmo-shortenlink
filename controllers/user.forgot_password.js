const account = require('../models/account')
// const nodemailer = require('nodemailer')
const { sendMailQueue } = require('../config/mailer_job_queue')
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
            req.flash('success', 'an email has been sent to your email')
            res.json({ messages: 'done', success: true })
            let data = {
                token: result[0],
                email: result[1],
                opt: '0'
            }
            let options = { priority: 1 }
            sendMailQueue.add(data, options)
            return resolve('done')
        })
    }
}