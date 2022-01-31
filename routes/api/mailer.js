const log = require('../../logger')
const router = require('express').Router()
const nodemailer = require('nodemailer')
const { json } = require('body-parser')

const Creds = require('../../models/Creds')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.REPORT_EMAIL_FROM,
        pass: process.env.REPORT_EMAIL_FROM_PW
    }
})

async function getClientEmail(userId) {
    let clientCreds;
    try {
        clientCreds = await Creds.findOne({ userId: userId })
        return clientCreds.username
    } catch (e) {
        log("DB-ERR", e)
        return "N/A"
    }
}

router.post('/', async (req, res) => {
    const description = req.body.description
    const userId = req.body.token
    const contactClient = req.body.contactClient
    const email = contactClient ? await getClientEmail(userId) : 'N/A'

    const message = `Message from user "${userId}": "${description}" \nOK to Contact?: ${contactClient}\nEmail: ${email}`

    log('MAIL-INFO','Received issue report: '+JSON.stringify(req.body))

    const mailOptions = {
        from: process.env.REPORT_EMAIL_FROM,
        to: process.env.REPORT_EMAIL_TO,
        subject: 'Cloverleaf Issue Report',
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

module.exports = router