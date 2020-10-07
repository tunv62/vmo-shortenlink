const account = require('../models/account')

module.exports = (req, res)=>{
    let { firstname, lastname ,description} = req.body
    account.findById(req.user._id, {info: 1}, (err, acc)=>{
        if (err) return res.json({message: 'try again', success: true})
        if ( !acc ) return res.json({message: '', success: false})
        acc.info.firstname = firstname
        acc.info.lastname = lastname
        acc.info.description = description
        acc.save(err=>{
            if (err) return res.json({message: 'try again', success: true})
            res.json({message: '', success: true})
        })
    })
}