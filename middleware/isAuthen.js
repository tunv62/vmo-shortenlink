module.exports = (req, res, next) => {
    console.log('is authen')
    if (req.isAuthenticated()) {
        next()
    } else {
        res.json({ message: 'not have access, you have to login', success: false })
    }
}