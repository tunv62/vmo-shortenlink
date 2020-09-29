const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    var r = /^[-a-zA-Z0-9_\+\.]{7,50}$/i
    let shortUrl = req.params.shortenlink
    if ( !r.test(shortUrl))  res.render('page_not_found')
    else {
        shortlink.findOne({ shortUrl: shortUrl }, (err, link)=>{
            if ( err || !link ) return res.render('page_not_found')
            link.clicks += 1
            console.log(typeof link.clicks)
            link.save(err =>{
                if (err) return res.render('page_not_found')
                res.writeHead(301,{ Location: link.longUrl })
                res.end()
            })
        })
    }
}