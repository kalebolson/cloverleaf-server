const router = require('express').Router()
const Airtable = require('airtable')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : ''
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : ''
const base = new Airtable({apiKey: key}).base(baseID)


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
    var newProject = new Project(req.body)

    newProject.save()
        .then((project) => {
            res.json(project)
            res.send(`${req.body.projectName} added successfully`)
        })
        .catch(err => res.send(err))
})

// @route   DELETE api/projects/:id
// @desc    delete a project
// @access  Public
router.delete('/:id', (req, res) => {
    Project.findById(req.params.id)
        .then(project => project.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}))
}) 

// @route   GET api/projects/at/:email
// @desc    Get all projects for a specific client from airtable (email address as key)
// @access  Public
router.get('/at/:email', (req, res) => {
    var results = []

    //This syntax is from airtable API documentation
    //eachPage() accepts a function to be applied to each page of the AT table,
    //then a function to execute after completion. This is evidently how they
    //recommend handling async requests 
    base('Projects').select({
        filterByFormula: `REGEX_MATCH({Client Email}, "^${req.params.email}")`,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            results.push(record.fields)
            
        })
        fetchNextPage()   
    }, (err) => {
        if (err) {
            console.log(err)
            res.json(err)
        }
        else {
            console.log(results)
            res.json(results)
        }
    })
})

module.exports = router