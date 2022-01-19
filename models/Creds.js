const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CredsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = Creds = mongoose.model('creds', CredsSchema)