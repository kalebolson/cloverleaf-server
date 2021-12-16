const fs = require('fs')

const log = (evtType, message, printToConsole = true) => {
    // Get current date/time
    const dateTime = new Date(Date.now())
    const isoDT = dateTime.toISOString()

    // Assemble message
    const event = '--' + isoDT + " | " + evtType + " | " + message

    // Create folder if !exists
    const dir = './logs'
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    // Create file for today if !exists
    // Write to file
    const fileName = dateTime.getFullYear() + '-' + ('0' + (dateTime.getMonth()+1)).slice(-2) + '-' + ('0' + (dateTime.getDate()+1)).slice(-2) + '.txt'
    try {
        fs.writeFileSync(`./logs/${fileName}`, event+'\n', { flag: 'a' })
        if (printToConsole)
            console.log("Event logged:\n", event)
      } catch (err) {
        console.error(err)
        console.log("Event NOT logged:", event)
      }
}

module.exports = log