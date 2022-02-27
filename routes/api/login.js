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
        //TODO 
        //use dynamodb in prod environment using ../../dbconn/dbconn.js
        const userID = req.body.username.split('@')[0]
        try{
            let user = await (await dbconn.getUser({userID: userID})).Item
            console.log(user)

            if (user == undefined){
                //If user not in DB, check for email in airtable
                checkAirtable(req, res)
            }
            else {
                bcrypt.compare(req.body.password, user.PasswordHash, (err, success) => {
                    if (success){
                        log("API-SUCC", "Password hash matched")
                        res.json({ token: user.UserID })
                    } 
                    else {
                        log("API-ERR", "Password hash mismatch")
                        res.status(401).send({ message: "Invalid Credentials" })
                    }
                })
            }
        } catch (err) {
            log("API-ERR", "Error retrieving from DynamoDB: "+err)
        }
})

function checkAirtable(req, res) {
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
                log("LOGIN-SUCC", "New user logged in, saving to db")
                    bcrypt.hash(req.body.password, 12, (err, hash) => {
                        if (err) log ("LOGIN-ERR", "Error when hashing password")
                        else {
                            dbconn.saveUser({
                                username: req.body.username, 
                                UserID: req.body.username.split('@')[0],
                                PasswordHash: hash
                            })
                            .then(() => {
                                res.json({ message: "User saved to DB successfully" })
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
    const user = await (await dbconn.getUser({userID: req.body.userId})).Item

    bcrypt.compare(req.body.oldPW, user.PasswordHash, (err, success) => {
        if (success){
            bcrypt.hash(req.body.newPW, 12, (err, hash) => {
                dbconn.updateUserPassword({UserID: user.UserID, PasswordHash: hash})
                res.json({ message: 'Password updated successfully' })
            })
        }
        else {
            const error = 'Old Password Incorrect'
            log('LOGIN-ERR', error)
            res.status(401).json({ error: error })
        }
    })
})

module.exports = router
