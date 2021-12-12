const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    recID: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ['Mockup', 'Production', 'Edit', 'Mix', 'Master', '`', '']
    },
    version: {
        type: Number
    },
    clientEmail: {
        type: String
    },
    status: {
        type: String,
        enum: ['Awaiting Internal Review', 'Request Client Review', 
            'Awaiting Client Review', 'Needs Revision', 'Needs Re-Recording',
            'Approved', 'Needs Archiving', 'Complete', 'Pre-File', 
            'New Version Available', '']
    },
    notes: {
        type: String
    },
    project: {
        type: String
    },
    client: {
        type: String
    },
    fileURL: {
        type: String
    },
    reviewURL: {
        type: String
    },
    dateSent: {
        type: Date
    },
    reviewDeadline: {
        type: Date
    }

}) 

module.exports = File = mongoose.model('file', FileSchema)