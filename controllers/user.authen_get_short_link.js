module.exports = (req, res, next)=>{
    if (req.isAuthenticated()) next()
    else{
        req.flash('error', 'you have to login')
        res.json({ message: '', success: '-1'})
    }
}