const account = require('../models/account')

module.exports = (req, res)=>{
    console.log(req.user)
    account.findById(req.user._id, 
        {'info.firstname': 1, 'info.lastname': 1, 'info.description': 1},
        (err, acc)=>{
            if ( err ) return res.json({ message: 'opps', success: false})
            if ( !acc ) return res.json({ message: 'opps', success: false})
            let dt = {
                firstname: acc.info.firstname,
                lastname: acc.info.lastname,
                description: acc.description
            }
            res.json({ message: dt, success: true })
        })
}