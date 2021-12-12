const router = require('express').Router()
const Airtable = require('airtable')

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
            res.json({
                message: `"${req.body.title}" added successfully`,
                content: file
            })
        })
        .catch(err => res.send(err))
})

// @route   DELETE api/files/:id
// @desc    delete a file
// @access  Public
router.delete('/:id', (req, res) => {
    File.findById(req.params.id)
        .then(file => file.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}))
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
            console.log(results)
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