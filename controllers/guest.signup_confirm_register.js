module.exports = (req, res) => {
    let email = req.flash('info')
    res.render('confirm_register', { email: email })
}