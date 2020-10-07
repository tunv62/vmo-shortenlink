const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    shortlink.find({
        creator: req.user._id,
        isDeleted: false
    }, {
        creator: 0,
        blockBy: 0,
        isDeleted: 0,
        deletedAt: 0,
        timeClicks: 0
    }, (err, link)=>{
        if ( err ) return res.json({ message: [], success: false})
        console.log(link)
        res.json({message: link, success: true})
    })
}