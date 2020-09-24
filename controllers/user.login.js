module.exports = (req, res) => {
    let error = req.flash('error')
    if (error.length > 0) res.render('login', { messages: error, type: false })
    else {
        let success = req.flash('success')
        res.render('login', { messages: success, type: true })
    }
}