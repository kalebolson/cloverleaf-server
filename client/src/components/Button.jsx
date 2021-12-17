import React from 'react'

const Button = ({ text, className, btnLink }) => {
    return (
        <a href={btnLink}>
            <button className={className}>
                {text}
            </button>
        </a>

    )
}

export default Button
