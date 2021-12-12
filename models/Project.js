const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProjectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    projectStatus: {
        type: String,
        enum: ['Upcoming', 'In Progress', 'Complete', '']
    },
    projectType: {
        type: [String]
    },
    notes: {
        type: String
    },
    tasks: {
        type: String
    },
    dueDate: {
        type: Date
    }
})

module.exports = Project = mongoose.model('project', ProjectSchema)