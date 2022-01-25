const log = require('../../logger')
const router = require('express').Router()
const nodemailer = require('nodemailer')
const { json } = require('body-parser')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.REPORT_EMAIL_FROM,
        pass: process.env.REPORT_EMAIL_FROM_PW
    }
})



router.post('/', (req, res) => {
    const description = "Issue Report: "+req.body.description
    const userId = req.body.token
    const contactClient = req.body.contactClient

    const message = `"Message from user "+${userId}+": \""+${description}+"\" --- OK to Contact: "+${contactClient}`

    log('MAIL-INFO','Received issue report: '+JSON.stringify(req.body))

    const mailOptions = {
        from: process.env.REPORT_EMAIL_FROM,
        to: process.env.REPORT_EMAIL_TO,
        subject: 'Cloverleaf Issue Report',
        text: description
    }

    transporter.sendMail(mailOptions, (err, response) => {
        if (err){
            log('MAIL-ERR', JSON.stringify(err))
            res.send(err)
        } else {
            log('MAIL-SUCC', JSON.stringify(response))
            res.send(response)
        }
    })
    
})

module.exports = router