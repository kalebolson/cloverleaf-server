import React from 'react'

function MobileFileContainerList ({ names, onChangeFile }) {
        const options = names.map((name) => {
            name = (name.length < 30) ? name : name.substring(0, 27) + "..."
            return(<option key={name} value={name}>{name}</option>)
        })
        return (
            <div className='selector-container'>
                <label className='selector-label' htmlFor="fileNames">File:</label>
                <select className='selector-list' onChange={onChangeFile} name='fileNames'>
                {options}
                </select>
            </div>
            
        )

}

export default MobileFileContainerList
