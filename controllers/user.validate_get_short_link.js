
module.exports = (req, res, next)=>{
    console.log('in validate')
    let regExLonglink = /^(?:http(?:s)?:\/\/)[-a-zA-Z0-9@:%_\+\)\(,.~#?&//=]{5,2000}$/i
    let regExPassword = /^[a-zA-Z0-9]{5,50}$/i
    let regExCustomLink = /^[-a-zA-Z0-9_\+\.]{7,100}$/i
    let regExExpire = /^[1-9][0-9]?$/i
    let regExOption = /^(?:0|1|2)$/i
    let { longLink, password, customLink, expire, selected} = req.body
    if ( !regExLonglink.test(longLink) ) 
        return res.json({ message: 'link illegal', success: false })
    if ( !regExOption.test(selected))
        return res.json({ message: 'option illegal', success: false })
    if ( password ) 
        if ( !regExPassword.test(password)) 
            return res.json({ message: 'password illegal', success: false })
    if ( customLink )
        if ( !regExCustomLink.test(customLink))
            return res.json({ message: 'custom link illegal', success: false })
    if ( expire )
        if ( !regExExpire.test(expire))
            return res.json({ message: 'expire illegal', success: false })
    return next()
}