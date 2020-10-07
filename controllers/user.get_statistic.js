const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let { id } = req.body
    console.log(id)
    shortlink.findById(id, { timeClicks: 1}, (err, link)=>{
        console.log('check----')
        if ( err || !link ) return res.json({ message: 'opps', success: false})
        res.json({ message: link.timeClicks, success: true })
    })
}