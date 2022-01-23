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
    const subject = "Issue Report: "+req.body.subject
    const userId = req.body.token
    const contactClient = req.body.contactClient

    const message = "Message from user"+userId+": \""+req.body.message+"\" \n OK to Contact: "+contactClient

    log('Received issue report: '+JSON.stringify(req.body))

    const mailOptions = {
        from: process.env.REPORT_EMAIL_FROM,
        to: process.env.REPORT_EMAIL_TO,
        subject: subject,
        text: message
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