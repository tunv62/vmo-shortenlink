const account = require('../models/account')

module.exports = (req, res)=>{
    let { email, code } = req.body
    if ( !email || !code){
        res.status(200).json({ messages: 'you have to input value', success: false })
    }else{
        account.findOne({'local.email': email}, (err, acc)=>{
            if(err) res.json({ messages: 'not find', success: false})
            if (!acc) res.json({ messages: 'email not found', success: false})
            else {
                if(acc.local.is_active === true || acc.local.expire < Date.now())
                    res.json({messages: 'wrong, code was expired', success: false})
                else {
                    if(acc.local.token === code){
                        acc.local.is_active = true
                        acc.save((err)=>{
                            if(err) res.json({ messages: 'not save', success: false})
                            else res.json({messages: 'success', success:true})
                        })
                    } 
                    else res.json({messages: 'wrong, code not matching', success: false })
                }
            }
        })
    }
}