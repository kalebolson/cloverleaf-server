const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
const base = new Airtable({apiKey: key}).base(baseID)

router.get('/name/:recid', (req, res) => {

    base('Contacts').find(req.params.recid, (err, record) => {
        if (err){
            log("API-ERR", "Error finding name based on client RecordID: "+req.params.recid+" - error: "+err)
            res.status(400).send({message: err})
        }
        else {
            log("API-SUCC", "Found contact based on RecordID "+req.params.recid+", returning name")
            res.json( {name: record.fields.Name} )
        }
    })

    // var name = ""
    // base('CLIENTSPLACEHOLDERTABLE').select({
    //     maxRecords: 1,
    //     filterByFormula: `REGEX_MATCH({Client Email}, "^${req.params.email}")`
    // }).eachPage(function page(records, fetchNextPage) {
    //     records.forEach((record) => {
    //         name = record.fields.Client;
    //     })
    //     fetchNextPage()   
    // }, (err) => {
    //     if (err) {
    //         log('API-ERR', err)
    //         res.json(err)
    //     }
    //     else {
    //         log('API-SUCC', name)
    //         res.json(name)
    //     }
    // })
})

module.exports = router