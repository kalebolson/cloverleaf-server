const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
const base = new Airtable({apiKey: key}).base(baseID)


// Project Model
const Project = require('../../models/Project')


// @route   GET api/projects
// @desc    get all Projects
// @access  Public
router.get('/', (req, res) => {
    Project.find()
        .sort( { dueDate: -1 })
        .then(projects => {
            res.json(projects)
            log('API-SUCC', projects)
        })
        .catch(err => {
            res.json(err)
            log('API-ERR', err)
        })
})

// @route   POST api/projects
// @desc    create a new project
// @access  Public
router.post('/', (req, res) => {
    var newProject = new Project(req.body)

    newProject.save()
        .then((project) => {
            const resObj = {
                message: `${req.body.projectName} added successfully`,
                content: project
            }
            res.json(resObj)
            log('API-SUCC', resObj)
        })
        .catch(err => {
            res.send(err)
            log('API-ERR', err)
        })
})

// @route   DELETE api/projects/:id
// @desc    delete a project
// @access  Public
router.delete('/:id', (req, res) => {
    Project.findById(req.params.id)
        .then(project => project.remove().then(() => {
            const resObj = {
                message: `"${req.params.id}" removed successfully`,
                content: file
            }
            res.json(resObj)
            log('API-SUCC', resObj)
        }))
        .catch(err => {
            res.status(404).json({success: false})
            log('API-ERR', resObj)
        })
}) 

// @route   GET api/projects/at/:email
// @desc    Get all projects for a specific client from airtable 
// @access  Public
router.get('/at/:recid', (req, res) => {
    var results = []
    //This syntax is from airtable API documentation
    //eachPage() accepts a function to be applied to each page of the AT table,
    //then a function to execute after completion. This is evidently how they
    //recommend handling async requests 
    
    // I cannot get a filterByFormula to filter this stuff properly.
    // The client ID is stored in an array in case there are ever multiple clients.
    // Airtable doesn't seem to have a great way to search arrays for values
    // so I am pulling all records and searching them, probably not ideal for performance

    let RecordID = req.params.recid
    base('Projects').select({
        //filterByFormula: `REGEX_MATCH(ARRAYJOIN({Client}, ","), "/${req.params.recid}/")`
        //view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            let clientIDArray = record.fields.Client
            if (clientIDArray){
                if (clientIDArray.includes(RecordID)){
                    results.push({...record.fields, "Record ID": record.id})
                }
            }
        })
        try{
            fetchNextPage()
        } catch (e) {
            log("AT-ERR", e)
        }
    }, (err) => {
        
        if (err) {
            res.json(err)
            log('API-ERR', err)
        }
        else {
            res.json(results)
            log('API-SUCC', JSON.stringify(results))
        }
    })
})

module.exports = router