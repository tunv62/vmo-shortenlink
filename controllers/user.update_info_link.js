const shortlink = require('../models/shortlink')

module.exports = (req, res)=>{
    let { id ,password, customLink, expire, selected} = req.body
    if (customLink) {
        checkCustomLink()
            .then(()=> updateInfoLink())
            .catch(err => {
                if (err) res.json({ message: err, success: true })
                else res.json({ message: err, success: false })
            })
    } else {
        shortlink.findById(id, (err, link)=>{
            if (err) return res.json({ message: '', success: false })
            if (!link) return res.json({ message: 'link does not exist', success: true })
            if (password) link.password = password
            if (expire) {
                if (selected === '0') {
                    let date = new Date()
                    date.setMinutes(date.getMinutes() + parseInt(expire))
                    link.expire = date
                } else if (selected === '1') {
                    let date = new Date()
                    date.setHours(date.getHours() + parseInt(expire) )
                    link.expire = date
                } else if (selected === '2') {
                    let date = new Date()
                    date.setDate(date.getDate() + parseInt(expire))
                    link.expire = date
                }
            }
            link.save(err => {
                if (err) return res.json({ message: '', success: false })
                res.json({ message: '', success: true })
            })
        })
    }

    function checkCustomLink(){
        return new Promise((resolve, reject)=>{
            shortlink.findOne({ shortUrl: customLink}, (err, link)=>{
                if (err) return reject('')
                if (link) return reject('link existed')
                return resolve()
            })
        })
    }
    function updateInfoLink(){
        return new Promise((resolve, reject)=>{
            shortlink.findById(id, (err, link)=>{
                if (err) return reject('')
                if (!link) return reject('id wrong') 
                if (password) link.password = password
                link.shortUrl = customLink
                if (expire) {
                    if (selected === '0') {
                        let date = new Date()
                        date.setMinutes(date.getMinutes() + parseInt(expire))
                        link.expire = date
                    } else if (selected === '1') {
                        let date = new Date()
                        date.setHours(date.getHours() + parseInt(expire) )
                        link.expire = date
                    } else if (selected === '2') {
                        let date = new Date()
                        date.setDate(date.getDate() + parseInt(expire))
                        link.expire = date
                    }
                }
                link.save(err => {
                    if (err) return reject('')
                    res.json({ message: '', success: true })
                    resolve()
                })
            })
        })
    }
}