import React from 'react'

function MobileFileContainerList ({ names, onChangeFile }) {
        const options = names.map((name) => <option key={name} value={name}>{name}</option>)
        return (
            <div>
                <label htmlFor="fileNames">File:</label>
                <select onChange={onChangeFile} name='fileNames'>
                {options}
                </select>
            </div>
            
        )

}

export default MobileFileContainerList
