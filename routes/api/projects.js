const router = require('express').Router()


// Project Model
const Project = require('../../models/Project')


// @route   GET api/projects
// @desc    get all Projects
// @access  Public
router.get('/', (req, res) => {
    Project.find()
        .sort( { dueDate: -1 })
        .then(projects => res.json(projects))
})

// @route   POST api/projects
// @desc    create a new project
// @access  Public
router.post('/', (req, res) => {
    var newProject = new Project({
        projectName: req.body.projectName,
        client: req.body.client,
        projectStatus: req.body.projectStatus ? req.body.projectStatus : '',
        projectType: req.body.projectType ? req.body.projectType : '',
        notes: req.body.notes ? req.body.notes : '',
        tasks: req.body.tasks ? req.body.tasks : '',
        dueDate: req.body.dueDate ? req.body.dueDate : ''
    })

    newProject.save()
        .then((project) => {
            res.json(project)
            res.send(`${req.body.projectName} added successfully`)
        })
        .catch(err => res.send(err))
}) 

module.exports = router