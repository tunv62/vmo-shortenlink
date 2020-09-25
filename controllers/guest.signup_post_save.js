const account = require('../models/account')

module.exports = (req, res, next) => {
    account.findOne({
        'local.email': req.body.email
    }, function (err, acc) {
        if (err) {
            req.flash('error', 'email is exist or try again')
            return res.redirect('/signup')
        }
        if (acc) {
            if (acc.local.is_active === true) {
                req.flash('error', 'email is exist or try again')
                return res.redirect('/signup')
            } else {
                acc.local.email = req.body.email
                acc.local.password = req.body.password
                acc.info.firstname = req.body.firstname
                acc.info.lastname = req.body.lastname
                acc.save(function (err) {
                    if (err) {
                        req.flash('error', 'email is exist or try again')
                        res.redirect('/signup')
                    } else next()
                })
            }
        } else {
            let newAcc = new account()
            newAcc.local.email = req.body.email
            newAcc.local.password = req.body.password
            newAcc.info.firstname = req.body.firstname
            newAcc.info.lastname = req.body.lastname
            newAcc.save(function (err) {
                if (err) {
                    req.flash('error', 'email is exist or try again')
                    res.redirect('/signup')
                } else next()
            })
        }
    })
}