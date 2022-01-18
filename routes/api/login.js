const router = require('express').Router()
const log = require('../../logger')

router.use('/', (req, res) => {
    // TODO - 
    // Set up DB for storing creds
    // Check submitted creds against db, return {token: user ID (email prefix)} if email and password match
    // return { token: false } if email found but password not found
    // If email is not found in DB, check for email address in airtable, and that the provided password is the default (either the email prefix or something like 'welcome1')
    // If so, save creds to db

    // This is just the test setup
    log("LOGIN", "Received request: "+JSON.stringify(req.body))
    res.json((req.body.username === 'test' & req.body.password === 'test')
        && { token: req.body.username}
    )
})

router.use('/changepw', (req, res) => {
    // Check submitted creds against db
    // If found, then change password in db to supplied new password

    // This should prompt on first login, and should be a button inside the app as well. 
    // Maybe just a small button in the footer

    console.log('change pw feature not yet implemented')
})

module.exports = router