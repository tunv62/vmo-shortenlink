const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    local: {
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        role: {
            type: String,
            default: 'user'
        },
        is_block: {
            type: Boolean,
            default: false
        },
        token: String,
        expire: Date,
        is_active: {
            type: Boolean,
            default: false
        }
    },
    google: {
        api_id: String,
        api_email: String
    },
    info: {
        firstname: String,
        lastname: String,
        avatar: String,
        description: String
    }
})

const account = mongoose.model('account', accountSchema)

module.exports = account