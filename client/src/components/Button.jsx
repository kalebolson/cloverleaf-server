import React from 'react'
import alertIcon from '../images/exclamation.svg'

const Button = ({ text, className, btnLink, onClick, alert }) => {
    const adjBtnLink = btnLink || ''
    return (
        <a href={adjBtnLink} target={!adjBtnLink.includes('amplifyapp.com') && '_blank'} className={alert ? 'btn-with-alert' : ''}>
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
