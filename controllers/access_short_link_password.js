const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let regExShortUrl = /^[-a-zA-Z0-9_\+\.]{7,50}$/i
    let regExPassword = /^[a-zA-Z0-9]{5,50}$/i
    let { password, shortUrl} = req.body
    if ( !regExShortUrl.test(shortUrl))  
        res.json({ message: 'link invalid', success: false })
    else if (!regExPassword.test(password)) 
        res.json({ message: 'password illegal', success: false })
    else {
        shortlink.findOne({ shortUrl: shortUrl }, (err, link)=>{
            if ( err || !link) return res.json({ message: 'link invalid', success: false })
            if ( link.isBlock ) return res.json({ message: 'link was Blocked', success: false })
            if ( link.expire ) 
                if ( link.expire < Date.now() ) 
                    return res.json({ message: 'link expired', success: false })
            if ( link.password !== password) 
                return res.json({ message: 'password wrong', success: false })
            link.clicks += 1
            link.timeClicks.push(new Date().toString())
            link.save(err =>{
                if (err) return res.json({ message: 'link invalid', success: false })
                res.json({ message: link.longUrl, success: true })
            })
        })
    }
}