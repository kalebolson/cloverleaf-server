const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : ''
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : ''
const base = new Airtable({apiKey: key}).base(baseID)


// File Model
const File = require('../../models/File')


// @route   GET api/files
// @desc    get all Files
// @access  Public
router.get('/', (req, res) => {
    File.find()
        .sort( { client: 1 })
        .then(files => res.json(files))
})

// @route   POST api/files
// @desc    post a new file to mongo
// @access  Public
router.post('/', (req, res) => {
    var newFile = new File(req.body)

    newFile.save()
        .then((file) => {
            const resObj = {
                message: `"${req.body.title}" added successfully`,
                content: file
            }
            res.json(resObj)
            log('API-SUCC', resObj)
        })
        .catch(err => {
            res.send(err)
            log('API-ERR', err)
        })
})

// @route   DELETE api/files/:id
// @desc    delete a file
// @access  Public
router.delete('/:id', (req, res) => {
    File.findById(req.params.id)
        .then(file => file.remove().then(() => {
            const resObj = {
                message: `"${req.params.id}" removed successfully`,
                content: file
            }
            res.json(resObj)
            log('API-SUCC', resObj)
        }))
        .catch(err => {
            log('API-ERR', err)
            res.status(404).json({success: false})
        })
}) 


// @route   GET api/files/at/:email
// @desc    Get all projects for a specific client from airtable (email address as key)
// @access  Public
router.get('/at/:email/:project', (req, res) => {
    var results = []

    //This syntax is from airtable API documentation
    //eachPage() accepts a function to be applied to each page of the AT table,
    //then a function to execute after completion. This is evidently how they
    //recommend handling async requests 
    base('File').select({
        filterByFormula: 
            `AND(
                REGEX_MATCH({Client Email}, "^${req.params.email}"),
                REGEX_MATCH({Project}, "^${req.params.project}")
            )`,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            results.push(record.fields)
        })
        fetchNextPage()   
    }, (err) => {
        if (err) {
            res.json(err)
            log('API-ERR', err)
        }
        else {
            res.json(results)
            log('API-SUCC', results)
        }
    })
})

module.exports = router