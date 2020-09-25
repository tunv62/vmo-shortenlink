module.exports = (req, res) => {
    let messages = req.flash('error')
    res.render('signup', {
        messages: messages
    })
}