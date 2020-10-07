module.exports = (req, res, next)=>{
    let regExPass = /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i
    let { currentPass, newPass} = req.body
    if (!regExPass.test(currentPass) || !regExPass.test(newPass)) 
        return res.json({message: 'password invalid', success: true})
    return next()
}