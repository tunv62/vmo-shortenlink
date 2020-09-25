const passport = require('passport')

module.exports = passport.authenticate('google.login', {
    successRedirect: '/logged',
    failureRedirect: '/login',
    failureFlash: true
})