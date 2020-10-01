module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('error', 'not have access, you have to login')
        res.redirect('/')
    }
}