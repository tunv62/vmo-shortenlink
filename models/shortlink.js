const mongoose = require('mongoose')

const linkSchema = mongoose.Schema({
    creator: String,
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    expire: Date,
    // isExpire: {
    //     type: Boolean,
    //     default: false
    // },
    createAt: {
        type: Date,
        default: new Date()
    },
    clicks: {
        type: Number,
        default: 0
    },
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