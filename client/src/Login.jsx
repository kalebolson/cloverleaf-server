import './Login.css'
import { useState } from 'react'

async function checkCreds(creds){
    return await fetch('/api/login', {
        method: "POST",
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify(creds)
    }).then(data => data.json())
}

export default function Login (props) {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()  
    const [invalidCreds, setInvalidCreds] = useState()

    const submitClicked = async (e) => {
        e.preventDefault()
        console.log("Submitting",username,password)
        const token = await checkCreds({
            username,
            password
        })
        !token.username ? setInvalidCreds(true) : setInvalidCreds(false)
        props.setToken(token)
    }
    return (
        <div className="login-wrapper">
            <h3>Welcome to the Portal! Please log in</h3>
            {invalidCreds && <p className='red italics'>Email or Password invalid</p>}
            <form onSubmit={submitClicked}>
                <label>
                    <p>Email Address</p>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" className='orange-btn'>Submit</button>
                </div>
            </form>
        </div>
    )
}