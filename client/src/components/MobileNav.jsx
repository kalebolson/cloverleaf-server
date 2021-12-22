import React from 'react'
import menuIcon from '../images/menu-icon.svg'
import closeMenuIcon from '../images/close-menu-icon.svg'

const MobileMenu = ( { className, icon, onNavClick, links, navOpen } ) => {
    const icons = {
        "menu": menuIcon,
        "closeMenu": closeMenuIcon
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
                    <li className='nav-list-item'><a href="">REPORT AN ISSUE</a></li>
                </ul>
            }

        </div>

    )
}

export default MobileMenu
