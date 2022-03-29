const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
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


// @route   GET api/files/at/:projectID
// @desc    Get all files for a specific project from airtable (email address as key)
// @access  Public
router.get('/at/:projectID', (req, res) => {
    var results = []

    //This syntax is from airtable API documentation
    //eachPage() accepts a function to be applied to each page of the AT table,
    //then a function to execute after completion. This is evidently how they
    //recommend handling async requests 

    // Same note as with projects query:
    // I cannot get a filterByFormula to filter this stuff properly.
    // The project ID is stored in an array in case there are ever multiple.
    // Airtable doesn't seem to have a great way to search arrays for values
    // so I am pulling all records and searching them, not ideal for performance

    let projectID = req.params.projectID
    base('Files').select({
        //filterByFormula: 
        //     `AND(
        //         REGEX_MATCH({Client Email}, "^${req.params.email}"),
        //         REGEX_MATCH({Project}, "^${req.params.project} for")
        //     )`,
        // view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            let projectIDArray = record.fields.Project
            if (projectIDArray){
                if(projectIDArray.includes(projectID)){
                    results.push({...record.fields, id: record.getId()})
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
            
            const respObj = results.map((obj) => {
                const adjustedStatus = (obj['Status'].toUpperCase() === 'NEEDS ARCHIVING') ? 'Approved' : obj['Status']             
                const file = {
                title: obj['Title'],
                stage: obj['Stage'],
                status: adjustedStatus,
                deadline: obj['Client Review Deadline'],
                notes: obj['Message to client'],
                link: obj['Client File URL'],
                reviewLink: obj['Web App ID'],
                version: obj['Version'],
                id: obj['id']
                }
                return file
            })
            .filter((obj) => ![
                'AWAITING INTERNAL REVIEW',
                'REQUEST CLIENT REVIEW',
                'PRE-FILE',
                'NEW VERSION AVAILABLE'
            ].includes(obj.status.toUpperCase()))

            res.json(respObj)
            //log('AIRTABLE', JSON.stringify(results))
            log('API-SUCC', JSON.stringify(respObj))
        }
    })
})

module.exports = router