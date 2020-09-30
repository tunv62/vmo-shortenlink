module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.json({ message: 'not have access, you have to login', success: false })
    }
}