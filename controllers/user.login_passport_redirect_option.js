const passport = require('passport')

module.exports = passport.authenticate('local.login', {
    successRedirect: '/logged',
    failureRedirect: '/login',
    failureFlash: true
})