const shortlink = require('../models/shortlink')
const cryptoRandomString = require('crypto-random-string')

module.exports = (req, res) => {
    let { longLink, password, customLink, expire, selected } = req.body
    if (customLink){
        // console.log('-run')
        createShortLink(customLink)
    }
    else {
        let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let shortUrl = cryptoRandomString({ length: 7, characters: char })
        if (!shortUrl) res.json({ message: 'link invalid or try again', success: '0' })
        else createShortLink(shortUrl)
    }
    function createShortLink(shortUrl) {
        shortlink.findOne({ shortUrl: shortUrl }, (err, link) => {
            if (err) return res.json({ message: 'link illegal or try again', success: '0' })
            if (link) return res.json({ message: 'link address existed, try again', success: '0' })
            let newLink = new shortlink()
            newLink.creator = req.user._id
            newLink.longUrl = longLink
            newLink.shortUrl = shortUrl
            newLink.createAt = Date.now()
            if (password) newLink.password = password
            if (expire && selected) {
                if (selected === '0') {
                    let date = new Date()
                    date.setMinutes(date.getMinutes() + parseInt(expire))
                    newLink.expire = date
                } else if (selected === '1') {
                    let date = new Date()
                    date.setHours(date.getHours() + parseInt(expire) )
                    newLink.expire = date
                } else if (selected === '2') {
                    let date = new Date()
                    date.setDate(date.getDate() + parseInt(expire))
                    newLink.expire = date
                }
            }
            newLink.save(err => {
                if (err) return res.json({ message: 'link illegal or try again', success: '0' })
                res.json({ message: process.env.nameDomain + shortUrl, success: '1' })
            })
        })
    }
}