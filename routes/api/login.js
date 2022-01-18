const router = require('express').Router()
const log = require('../../logger')

router.use('/', (req, res) => {
    log("LOGIN", "Received request: "+JSON.stringify(req.body))
    res.json((req.body.username === 'test' & req.body.password === 'test')
        && { token: req.body.username}
    )
})

module.exports = router