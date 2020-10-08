const account = require('../models/account')

module.exports = (req, res)=>{
    let { currentPass, newPass} = req.body
    account.findById(req.user._id, {local: 1}, (err, acc)=>{
        if (err || !acc) return res.json({message: '', success: false})
        if (acc.local.password !== currentPass) 
            return res.json({message: 'password invalid', success: true})
        acc.local.password = newPass
        acc.save(err => {
            if (err) return res.json({message: '', success: false})
            res.json({message: '', success: true})
        })
    })
}