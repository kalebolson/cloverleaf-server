import React from 'react'
import menuIcon from '../images/menu-icon.svg'
import closeMenuIcon from '../images/close-menu-icon.svg'
import { process_params } from 'express/lib/router'

const MobileMenu = ( { className, icon, onNavClick, links, navOpen, token, setToken, setChangePwPopUp, setReportIssuePopUp } ) => {
    const icons = {
        "menu": menuIcon,
        "closeMenu": closeMenuIcon
    }
    function onSignOut() {
        setToken(false)
        onNavClick()
    }

    return (
        <div className={`mobile-nav ${navOpen && "navOpen"}`}>
            <img 
                src={icons[icon]} 
                alt="Menu Toggle Button" 
                className={`${className} nav-toggle mobileOnly`} 
                onClick={onNavClick}
            />
            {navOpen &&
                <ul className='nav-list mobileOnly'>
                    <li className='nav-list-item'><a href={links["contactLink"]}>CONTACT</a></li>
                    <li className='nav-list-item'><a href={links["feedbackLink"]}>SUBMIT&nbsp;FEEDBACK</a></li>
                    {token && <li className='nav-list-item'><a href="#" onClick={(e) => setChangePwPopUp(true)}>CHANGE&nbsp;PASSWORD</a></li>}
                    {token && <li className='nav-list-item'><a href="#" onClick={onSignOut}>SIGN OUT</a></li>}
                </ul>
            }

        </div>

    )
}

export default MobileMenu
