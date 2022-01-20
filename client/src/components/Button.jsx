import React from 'react'

const Button = ({ text, className, btnLink, onClick }) => {
    return (
        <a href={btnLink}>
            <button className={className} onClick={onClick}>
                {text}
            </button>
        </a>

    )
}

export default Button
