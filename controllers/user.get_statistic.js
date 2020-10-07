const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let regExID = /^[a-zA-Z0-9]{5,100}$/i
    let { id } = req.body
    if ( !regExID.test(id) ) 
        return res.json({ message: '', success: true })
    shortlink.findById(id, { timeClicks: 1}, (err, link)=>{
        if ( err || !link ) return res.json({ message: 'opps', success: false})
        res.json({ message: link.timeClicks, success: true })
    })
}