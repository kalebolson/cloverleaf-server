
function Welcome({ clientName }) {
    var firstName = clientName ? clientName : ''
    try {
        firstName = clientName && clientName.split(' ')[0]
    }
    catch (err) {
        console.log(err)
    }
    
    return (
        <h1 className='welcome-header'>Welcome, {firstName}!</h1>
    )
}

export default Welcome