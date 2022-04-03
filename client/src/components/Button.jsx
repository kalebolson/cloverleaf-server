import React from 'react'
import alertIcon from '../images/exclamation.svg'

const Button = ({ text, className, btnLink, onClick, alert }) => {
    const adjBtnLink = btnLink || ''

    /*
    Buttons can be links or just buttons that have trigger functions. As such they are wrapped in links.
    This is probably not the best way to do this, but the css is already built out around links encompassing btns. 
    If this is ever refactored to make more sense, the css will need to be refactored as well.
    */
    return (
        <a href={adjBtnLink ? adjBtnLink : null} target={(adjBtnLink && !adjBtnLink.includes('amplifyapp.com')) ? '_blank' : null} className={alert ? 'btn-with-alert' : ''}>
            <button className={className} onClick={onClick}>
                {text}
            </button>
            {alert ? 
            <div className="alert-icon-container">
                <img src={alertIcon} alt="Notification Icon" className='alert-icon'/>
            </div>  : ''}
        </a>

    )
}

export default Button
