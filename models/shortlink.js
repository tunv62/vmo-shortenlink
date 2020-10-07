const mongoose = require('mongoose')

const linkSchema = mongoose.Schema({
    creator: String,
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: String,
    password: String,
    expire: Date,
    // isExpire: {
    //     type: Boolean,
    //     default: false
    // },
    createAt: Date,
    clicks: {
        type: Number,
        default: 0
    },
    timeClicks: [{ type: String}],
    isBlock: {
        type: Boolean,
        default: false
    },
    blockBy: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
})

const shortLink = mongoose.model('shortLink', linkSchema)

module.exports = shortLink