const account = require('../models/account')

module.exports = (req, res)=>{
        account.findOne({'local.email': req.body.email}, (err, acc)=>{
            if(err) res.json({ messages: 'not find', success: false})
            if (!acc) res.json({ messages: 'email not found', success: false})
            else {
                if(acc.local.is_active === true || acc.local.expire < Date.now())
                    res.json({messages: 'wrong, code was expired', success: false})
                else {
                    if(acc.local.token === req.body.code){
                        acc.local.is_active = true
                        acc.save((err)=>{
                            if(err) res.json({ messages: 'not save', success: false})
                            else {
                                req.flash('success', 'register account success, enter to login')
                                res.json({messages: 'success', success:true})
                            } 
                        })
                    } 
                    else res.json({messages: 'wrong, code not matching', success: false })
                }
            }
        })
}