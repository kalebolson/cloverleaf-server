const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const projectsRouter = require('./routes/api/projects')
const filesRouter = require('./routes/api/files')


const app = express()

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

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))