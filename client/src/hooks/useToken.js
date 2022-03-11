import { useState } from 'react'

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token')
        const userToken = JSON.parse(tokenString)
        console.log("got token",userToken,"from session storage")
        return userToken?.token
    }

    const [token, setToken] = useState(getToken())

    const saveToken = userToken => {
        console.log("setting token",userToken, "to session storage")
        sessionStorage.setItem('token', JSON.stringify(userToken))
        console.log("setting token",userToken,"to local storage")
        setToken(userToken)
    }

    return {
        setToken: saveToken,
        token
    }
}