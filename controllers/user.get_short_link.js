const shortlink = require('../models/shortlink')
const cryptoRandomString = require('crypto-random-string')

module.exports = (req, res) => {
    console.log('in create ')
    let { longLink, password, customLink, expire, selected } = req.body
    console.log(typeof expire)
    if (customLink)
        createShortLink(customLink)
    else {
        let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let shortUrl = cryptoRandomString({ length: 7, characters: char })
        if (!shortUrl) res.json({ message: 'link invalid', success: false })
        else createShortLink(shortUrl)
    }
    function createShortLink(shortUrl) {
        shortlink.findOne({ shortUrl: shortUrl }, (err, link) => {
            if (err) return res.json({ message: 'link illegal or try again', success: false })
            if (link) return res.json({ message: 'link exits, try again', success: false })
            let newLink = new shortlink()
            newLink.creator = req.user._id
            newLink.longUrl = longLink
            newLink.shortUrl = shortUrl
            if (password) newLink.password = password
            if (expire) {
                if (selected === '0') {
                    let date = new Date()
                    date.setMinutes(date.getMinutes() + parseInt(expire))
                    console.log(date)
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
                if (err) return res.json({ message: 'link illegal or try again', success: false })
                res.json({ message: shortUrl, success: true })
            })
        })
    }
}

// shortlink.findOne({ shortUrl: customLink }, (err, link)=>{
        //     if ( err ) return res.json({ message: 'link illegal or try again', success: false })
        //     if ( link ) return res.json({ message: 'link exits, try again', success: false })
        //     let newLink = new shortlink()
        //     newLink.creator = req.user._id
        //     newLink.longUrl = longLink
        //     newLink.shortUrl = customLink
        //     if ( password ) newLink.password = password
        //     if ( selected === '0'){
        //         let date = new Date()
        //         date.setMinutes(date.getMinutes() + expire)
        //         newLink.expire = date
        //     } else if (selected === '1'){
        //         let date = new Date()
        //         date.setHours(date.getHours() + expire)
        //         newLink.expire = date
        //     } else if (selected === '2'){
        //         let date = new Date()
        //         date.setDate(date.getDate() + expire)
        //         newLink.expire = date
        //     }
        //     newLink.save( err => {
        //         if ( err ) return res.json({ message: 'link illegal or try again', success: false })
        //         res.json({ message: customLink, success: true })
        //     })
        // })