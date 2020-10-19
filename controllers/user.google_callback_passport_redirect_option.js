const passport = require('passport')

module.exports = passport.authenticate('google.login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})