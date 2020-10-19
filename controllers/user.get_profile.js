const account = require('../models/account')
const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let infoUser = new Promise((resolve, reject)=>{
        account.findById(req.user._id, 
        {'info.firstname': 1, 'info.lastname': 1, 'info.description': 1},
        (err, acc)=>{
            if ( err || !acc) return reject('')
            let dt = {
                firstname: acc.info.firstname,
                lastname: acc.info.lastname,
                description: acc.info.description
            }
            return resolve(dt)
        })
    })

    let totalClicks = new Promise((resolve, reject)=>{
        shortlink.find({ 
            creator: req.user._id,
            isDeleted: false
        }, { clicks: 1, _id: 0},
            (err, total)=>{
                if (err) return reject('')
                return resolve(total)
            })
    })

    Promise.all([infoUser, totalClicks])
        .then( values => { res.json({ message: values, success: true }) })
        .catch( err => { res.json({ message: 'opps', success: false}) })
}