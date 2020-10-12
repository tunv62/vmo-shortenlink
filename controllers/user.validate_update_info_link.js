module.exports = (req, res, next)=>{
    let regExID = /^[a-zA-Z0-9]{5,100}$/i
    let regExPassword = /^[a-zA-Z0-9]{5,50}$/i
    let regExCustomLink = /^[-a-zA-Z0-9_\+\.]{7,100}$/i
    let regExExpire = /^[1-9][0-9]?$/i
    let regExOption = /^(?:0|1|2)$/i
    let { id ,password, customLink, expire, selected} = req.body
    if ( !regExID.test(id) ) 
        return res.json({ message: 'id does not exist', success: true })
    if ( !regExOption.test(selected))
        return res.json({ message: 'option illegal', success: true })
    if ( password ) 
        if ( !regExPassword.test(password)) 
            return res.json({ message: 'password illegal, least 5 character', success: true })
    if ( customLink )
        if ( !regExCustomLink.test(customLink))
            return res.json({ message: 'custom link illegal, least 7 character', success: true })
    if ( expire )
        if ( !regExExpire.test(expire))
            return res.json({ message: 'expire illegal, only use 1-99', success: true })
    return next()
}