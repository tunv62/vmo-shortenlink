const Queue = require('bull')
const nodemailer = require('nodemailer')

//initiating the queue
const sendMailQueue = new Queue('sendMailer', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    },
    limiter: {
        max: 500,
        duration: 5000
    }
})

sendMailQueue.process(async job => {
    try {
        // 1 signup; 0 forgot; 2 pass change success 
        if (job.data.opt === '1')
            return await guestConfirmSignup(job.data.email, job.data.code)
        else if (job.data.opt === '0')
            return await userForgotPassword(job.data.email, job.data.token)
        else 
            return await userChangeSuccess(job.data.email)
    } catch (error) {
        console.log('mail error')
    }
})

function guestConfirmSignup(email, code) {
    return new Promise( (resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SEND, 
                pass: process.env.EMAIL_PASSWORD_SEND
            },
            tls: { rejectUnauthorized: false }
        })
        var content = ''
        content += `
            <div style="padding: 10px; background-color: #003375">
                <div style="padding: 10px; background-color: white;">
                    <h4 style="color: #0085ff">verification code to register account</h4>
                    <span style="color: black">code: `+ code + `</span> <hr>
                    <span style="color: black">expired: 5 minutes</span>
                </div>
            </div>
        `
        var mainOptions = {
            from: 'shortenLink',
            to: email,
            subject: 'shortenLink: signup account',
            html: content
        }
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) return reject(false)
            else return resolve('done')
        })
    })
}

function userForgotPassword(email, token) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
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
                    <h4 style="color: #0085ff">verification link to reset password</h4>
                    <span style="color: black">
                        `+ process.env.nameDomain +`reset/`+ token + `</span> <hr>
                    <span style="color: black">expired: 5 minutes</span>
                </div>
            </div>`
        var mainOptions = {
            from: 'shortenLink',
            to: email,
            subject: 'shortenLink: reset password',
            html: content
        }
        transporter.sendMail(mainOptions, (err) => {
            if (err) return reject(false)
            return resolve('done')
        })
    })
}

function userChangeSuccess(email) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SEND,
                pass: process.env.EMAIL_PASSWORD_SEND
            },
            tls: { rejectUnauthorized: false }
        });
        var content = ''
        content += `
            <div style="padding: 10px; background-color: #003375">
                <div style="padding: 10px; background-color: white;">
                    <h4 style="color: #0085ff">successfully</h4>
                    <span style="color: black">the password for your account 
                        `+ email + ` has just been changed.</span> <hr>
                    <span style="color: black">expired: 5 minutes</span>
                </div>
            </div>`
        var mainOptions = {
            from: 'shortenLink',
            to: email,
            subject: 'shortenLink: reset password success',
            html: content
        }
        transporter.sendMail(mainOptions, (err) => {
            if (err) return reject(false)
            return resolve('done')
        })
    })
}

module.exports = { sendMailQueue: sendMailQueue }