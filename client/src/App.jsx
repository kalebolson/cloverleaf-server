import Route2Test from "./Route2Test"
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import Login from "./Login"
import useToken from './hooks/useToken'
import Header from "./components/Header"
import Divider from "./components/Divider"

function App() { 
    const { token, setToken } = useToken()

    return (
        <div className="wrapper">
            <div className="App">
            <Header />
            <Divider />
            {!token
            ? <Login setToken={setToken} />
            : <Home token={token} />}
            </div>
        </div>
    )
}

export default App