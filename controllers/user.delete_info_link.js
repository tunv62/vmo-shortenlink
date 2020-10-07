const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let { id } = req.body
    let regExID = /^[a-zA-Z0-9]{5,100}$/i
    if ( !regExID.test(id) ) 
        return res.json({ message: 'id does not exist', success: true })
    shortlink.findById(id, (err, link)=>{
        if ( err ) return res.json({ message: '', success: false })
        if ( !link ) return res.json({ message: 'link does not exist', success: true })
        link.shortUrl = ''
        link.isDeleted = true
        link.deletedAt = Date.now()
        console.log('-check---')
        link.save( (err)=>{
            if (err){
                console.log('whu --------')
                return res.json({ message: '', success: false })
            } 
            res.json({ message: '', success: true })
        })
    })
}