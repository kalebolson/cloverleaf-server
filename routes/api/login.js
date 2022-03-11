const router = require('express').Router()
const Airtable = require('airtable')
const log = require('../../logger')
const bcrypt = require('bcryptjs')
const key = process.env.ENV === "DEV" ? process.env.AT_KEY_DEV : process.env.AT_KEY_PROD
const baseID = process.env.ENV === "DEV" ? process.env.AT_BASE_DEV : process.env.AT_BASE_PROD
const Creds = require('../../models/Creds')
const dbconn = require('../../dbconn/dbconn')

const base = new Airtable({apiKey: key}).base(baseID)

// @route   POST api/login
// @desc    Attempt to authenticate entered credentials
// @access  Public
router.post('/', async (req, res) => {
        //use dynamodb in prod environment using ../../dbconn/dbconn.js
        console.log(req)
        let email = req.body.email
        try{
            let user = await dbconn.getUser({Email: email})
            console.log("user:",user)

            if (user == undefined){
                //If user not in DB, check for email in airtable
                checkAirtable(req, res)
            }
            else {
                bcrypt.compare(req.body.password, user.PasswordHash, (err, success) => {
                    if (success){
                        log("API-SUCC", "Password hash matched")
                        res.json({ token: user.RecordID })
                    } 
                    else {
                        if (err) console.log("Error", err)
                        log("API-ERR", `Password hash mismatch: ${JSON.stringify(req.body)}`)
                        res.status(401).send({ message: "Invalid Credentials" })
                    }
                })
            }
        } catch (err) {
            log("API-ERR", "Error retrieving from DynamoDB: "+err)
            res.status(400).send({message: "Something went wrong"})
        }
})

function checkAirtable(req, res) {

    base('Contacts').select({
        filterByFormula: `{Email} = "${req.body.email}"`,
        view: "Grid view"
    }).firstPage((err, records) => {
        if (err) {
            log("LOGIN-ERR", err)
            res.json({Error: err})
        }
        else {
            if (records.length > 0 & req.body.password == "welcome1") {
                log("LOGIN-SUCC", "New user logged in, saving to db")

                const RecordID = records[0].id
                bcrypt.hash(req.body.password, 12, (err, hash) => {
                    if (err) log ("LOGIN-ERR", "Error when hashing password: "+err)
                    else {
                        dbconn.saveUser({
                            RecordID: RecordID, 
                            Email: req.body.email,
                            PasswordHash: hash
                        })
                        .then(() => {
                            res.json({ 
                                message: "User saved to DB successfully",
                                token: RecordID
                            })
                        })
                    }
                })
            } else {
                log("LOGIN-ERR", `Invalid credentials sent: ${JSON.stringify(req.body)}`)
                res.status(401).send({
                    message: "Invalid Credentials"
                })
            }
        }
    })
}

router.post('/changepw', async (req, res) => {

    // Check submitted creds against db
    // If found, then change password in db to supplied new password
    const user = await dbconn.getUserByID({RecordID: req.body.RecordID})

    bcrypt.compare(req.body.oldPW, user.PasswordHash, (err, success) => {
        if (success){
            bcrypt.hash(req.body.newPW, 12, (err, hash) => {
                if (err){
                    log("API-ERR", err)
                    res.status(400).send({ message: err})
                }
                dbconn.updateUserPassword({RecordID: req.body.RecordID, PasswordHash: hash})
                res.json({ message: 'Password updated successfully' })
            })
        }
        else {
            const message = 'Old Password Incorrect'
            if (err) message = "Error: "+err
            log('LOGIN-ERR', message)
            res.status(401).json({ message: message })
        }
    })
})

module.exports = router
