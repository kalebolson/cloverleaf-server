import React from 'react'
import logo from '../images/cloverleaflogo.png'
import Button from './Button.jsx'
import {useState} from 'react'
import MobileNav from './MobileNav'

const Header = () => {

    const [navOpen, setNavOpen] = useState(false)

    function openNav(menu) {
      console.log("opening nav")
      setNavOpen(!navOpen)
    }
    const links = {
        "bookLink": "https://square.site/appointments/book/5HSTX0GJE5TAN/cloverleaf-audio-visual-saint-paul-mn",
        "contactLink": "https://www.cloverleaf.audio/contact"
    }


    return (
        <header>
            <div className="header-left">
                <img src={logo} alt="Cloverleaf Audio Logo" className="logo"/>
            </div>
            <div className={`header-right ${ navOpen && 'navOpen'}`}>
                <Button 
                    className="header-btns" 
                    text="CONTACT" 
                    btnLink={links["contactLink"]} 
                />
                <Button 
                    className="header-btns" 
                    text="REPORT AN ISSUE" 
                />
                <MobileNav 
                    className={!navOpen ? "nav-btn" : "close-nav-btn"}
                    icon={!navOpen ? "menu" : "closeMenu"} 
                    onNavClick={openNav}
                    navOpen={navOpen}
                    links = {links}
                />
            </div>
        </header>
    )
}

export default Header