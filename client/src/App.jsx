import Route2Test from "./Route2Test"
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import Login from "./Login"
import useToken from './hooks/useToken'

function App() { 
    const { token, setToken } = useToken()

    if (!token){
        return <Login setToken={setToken} />
    }

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path='/home' element={<Home />}/>
                    <Route path='/routetest' element={<Route2Test />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App