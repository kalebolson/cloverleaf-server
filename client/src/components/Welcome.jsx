
function Welcome({ clientName }) {
    const firstName = clientName && clientName.split(' ')[0]
    
    return (
        <h1 className='welcome-header'>Welcome, {firstName}!</h1>
    )
}

export default Welcome