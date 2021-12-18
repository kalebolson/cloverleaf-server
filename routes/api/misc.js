const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
const base = new Airtable({apiKey: key}).base(baseID)

router.get('/name/:email', (req, res) => {
    var name = ""

    base('Projects').select({
        maxRecords: 1,
        filterByFormula: `REGEX_MATCH({Client Email}, "^${req.params.email}")`
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach((record) => {
            name = record.fields.Client;
        })
        fetchNextPage()   
    }, (err) => {
        if (err) {
            log('API-ERR', err)
            res.json(err)
        }
        else {
            log('API-SUCC', name)
            res.json(name)
        }
    })
})

module.exports = router