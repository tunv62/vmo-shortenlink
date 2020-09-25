const account = require('../models/account')

module.exports = (req, res) => {
    account.findOne({ 'local.token': req.params.token }, (err, acc) => {
        if ( err || !acc ) return res.redirect('/page-not-found')
        if (acc.local.expire < Date.now() || acc.local.is_block === true ||
                    acc.local.is_active === false) return res.redirect('/page-not-found')
        res.render('reset_password')
    })
}