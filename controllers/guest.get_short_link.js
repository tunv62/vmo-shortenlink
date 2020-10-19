const shortlink = require('../models/shortlink')
const cryptoRandomString = require('crypto-random-string')

module.exports = (req, res) => {
    var { longLink } = req.body
    var r = /^(?:http(?:s)?:\/\/)[-a-zA-Z0-9@:%_\+\)\(,.~#?&//=]{5,2000}$/i
    if (!r.test(longLink)) res.json({ message: 'link invalid', success: false })
    else {
        let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let shortUrl = cryptoRandomString({ length: 7, characters: char })
        if (!shortUrl) res.json({ message: 'link invalid', success: false })
        else {
            shortlink.findOne({ shortUrl: shortUrl }, (err, link) => {
                if (err) return res.json({ message: 'link invalid or try again', success: false })
                if (link) return res.json({ message: 'try again', success: false })
                let newLink = new shortlink()
                newLink.longUrl = longLink
                newLink.shortUrl = shortUrl
                newLink.save((err) => {
                    if (err) res.json({ message: 'link invalid or try again', success: false })
                    res.json({ message: process.env.nameDomain + shortUrl, success: true })
                })
            })
        }
    }
}