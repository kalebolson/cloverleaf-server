const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const cors = require('cors')
const projectsRouter = require('./routes/api/projects')
const filesRouter = require('./routes/api/files')
const miscRouter = require('./routes/api/misc')
const log = require('./logger')
const path = require('path')

const app = express()

// Enable cors
app.use(cors())

// Bodyparser middleware
app.use(bodyParser.json())

// DB Config
const db = process.env.MONGO_URI

// Connect to mongo
mongoose.connect(db)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

//Use Routes
app.use('/api/projects', projectsRouter)
app.use('/api/files', filesRouter)
app.use('/api/misc', miscRouter)

// Ping
app.get('/ping', (req, res)=> {
    res.json("Online")
    console.log("pinged")
})
log ('DEBUG', `Current ENV value = ${process.env.ENV}`)
// Serve static assets if in prod
if(process.env.ENV === "PROD") {
    // Set static folder
    app.use(express.static('client/build'))
    log('STATIC',`Using static build folder in ${process.env.ENV} env`)

    app.get('*', (req, res) => {
        log('STATIC', `Served app on port ${port}`)
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => log('START', `Server started on port ${port}`))
//app.listen(port, () => console.log(`Server started on port ${port}`))