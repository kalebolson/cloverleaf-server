import React from 'react'
import alertIcon from '../images/exclamation.svg'

const Button = ({ text, className, btnLink, onClick, alert }) => {
    return (
        <a href={btnLink} className={alert ? 'btn-with-alert' : ''}>
            <button className={className} onClick={onClick}>
                {text}
            </button>
            {alert ? 
            <div className="alert-icon-container">
                <img src={alertIcon} alt="Notification Icon" className='alert-icon'/>
            </div>  
            : ''}
            
        </a>

    )
}

export default Button
