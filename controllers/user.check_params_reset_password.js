module.exports = (req, res, next)=>{
    let r = /^[a-zA-Z0-9]{20,100}$/i
    if (r.test(req.params.token)) return next()
    else return res.redirect('/page-not-found')
}