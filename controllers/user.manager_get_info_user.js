const account = require('../models/account')

module.exports = (req, res)=>{
    account.findById(req.user._id, 
        {'info.firstname': 1, 'info.lastname': 1}, 
        (err, acc)=>{
            if (err || !acc) return res.render('login')
            let name = acc.info.firstname + ' ' + acc.info.lastname
            res.render('manager', { name: name})
    })
}