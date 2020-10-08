module.exports = (req, res, next)=>{
    let regExFN = /^[a-zA-Z0-9\s\.]{3,20}$/i
    let regExLN = /^[a-zA-Z0-9\s\.]{3,20}$/i
    let regExDes = /^[a-zA-Z0-9\s\.,@]{0,50}$/i
    let { firstname, lastname ,description} = req.body
    if (!regExFN.test(firstname))
        return res.json({message: 'first name invalid', success: true})
    if (!regExLN.test(lastname))
        return res.json({ message: 'last name invalid', success: true})
    if (!regExDes.test(description))
        return res.json({ message: 'description invaid', success: true})
    return next()
}