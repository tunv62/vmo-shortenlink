const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    var r = /^[-a-zA-Z0-9_\+\.]{7,50}$/i
    let shortUrl = req.params.shortenlink
    if ( !r.test(shortUrl))  res.render('page_not_found')
    else {
        shortlink.findOne({ shortUrl: shortUrl }, (err, link)=>{
            if ( err || !link) return res.render('page_not_found')
            if ( link.isBlock ) return res.render('page_not_found')
            if ( link.expire ) 
                if ( link.expire < Date.now() ) return res.render('page_not_found')
            if ( link.password ) 
                return res.render('confirm_password_access_link', { shortUrl: process.env.nameDomain + shortUrl})
            link.clicks += 1
            // let a = new Date()
            // a.setDate(a.getDate() - 10)
            // link.timeClicks.unshift(a.toString())
            link.timeClicks.push(new Date().toString())
            link.save(err =>{
                if (err) return res.render('page_not_found')
                res.writeHead(301,{ Location: link.longUrl })
                res.end()
            })
        })
    }
}