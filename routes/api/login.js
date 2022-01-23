const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')

const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
const base = new Airtable({apiKey: key}).base(baseID)

const Creds = require('../../models/Creds')

// @route   POST api/login
// @desc    Attempt to authenticate entered credentials
// @access  Public
router.post('/', (req, res) => {
    // TODO - 
    // Set up DB for storing creds
    // Check submitted creds against db, return {token: user ID (email prefix)} if email and password match
    Creds.find({ username: req.body.username })
        .then((result) => {
            if (result.length === 0) {
                checkAirtable(req, res)
            } else if (result[0].password != req.body.password) {
                log("API-ERR", `Invalid credentials sent: ${JSON.stringify(req.body)}`)
                res.status(401).send({
                    message: "Invalid Credentials"
                })
            } else {
                res.json({token: result[0].userId})
            }
        })
        .catch((err) => res.status(500).send({Error: err}))

    // return { token: false } if email found but password not found
    // If email is not found in DB, check for email address in airtable, and that the provided password is the default (either the email prefix or something like 'welcome1')
    // If so, save creds to db

    // This is just the test setup
    // log("LOGIN", "Received request: "+JSON.stringify(req.body))
    // res.json((req.body.username === 'test' & req.body.password === 'test')
    //     && { token: req.body.username}
    // )
})

function checkAirtable(req, res) {
    console.log(req.body.username)
    base('Projects').select({
        filterByFormula: `{Client Email} = "${req.body.username}"`,
        view: "Grid view"
    }).firstPage((err, records) => {
        if (err) {
            log("LOGIN-ERR", err)
            res.json({Error: err})
        }
        else {
            if (records.length > 0 & req.body.password == "welcome1") {
                log("LOGIN-SUCC", "New user logged in, saving to mongodb")
                const newCreds = new Creds({...req.body, userId: (req.body.username.split('@')[0])})
                newCreds.save()
                    .catch(err => {
                        res.status(500).send({ Error: err })
                    })
                res.json({ token: newCreds.userId })
            } else {
                log("LOGIN-ERR", `Invalid credentials sent: ${JSON.stringify(req.body)}`)
                res.status(401).send({
                    message: "Invalid Credentials"
                })
            }
        }
    })
}

router.post('/changepw', (req, res) => {

    console.log(req.body.userId)
    console.log(req.body.oldPW)
    console.log(req.body.newPW)
    // Check submitted creds against db
    // If found, then change password in db to supplied new password
    // Creds.findOne({ userId: 'matthewgrosso95' }, (err, result) => {
    //     if (err){
    //         console.log("error",err)
    //     }
    //     console.log("success", result)
    //     res.json(result)
    // })
    const updCreds = Creds.findOne({ userId: req.body.userId, password: req.body.oldPW }, (err, updCreds) => {
        console.log(updCreds)
        if (err){
            log('LOGIN-ERR', err)
            res.status(400).send(err)
        }
        else if (!updCreds){
            const error = 'Old Password Incorrect'
            log('LOGIN-ERR', error)
            res.status(401).json({ error: error })
        }
        else {
            updCreds.password = req.body.newPW
            updCreds.save((err, data) => {
                if (err){
                    res.status(400).send(err)
                }
                else {
                    res.json({ data: data })
                }
            })
        }
    })
})

module.exports = router