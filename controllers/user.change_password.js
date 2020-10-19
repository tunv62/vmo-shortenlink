const account = require('../models/account')
const bcrypt = require('bcrypt')

module.exports = (req, res)=>{
    let { currentPass, newPass} = req.body
    account.findById(req.user._id, {local: 1},async (err, acc)=>{
        try {
            if (err || !acc) return res.json({message: '', success: false})
            if (await bcrypt.compare(currentPass, acc.local.password)){
                acc.local.password = await bcrypt.hash(newPass, 10)
                acc.save(err => {
                    if (err) return res.json({message: '', success: false})
                    res.json({message: '', success: true})
                })
            } else return res.json({message: 'password invalid', success: true})
        } catch (e) {
            return res.json({message: '', success: false})
        }
    })
}