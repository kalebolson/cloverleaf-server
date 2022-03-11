import React from 'react'
import { useState, useEffect } from 'react'
import MobileFileContainerDetails from './MobileFileContainerDetails'
import MobileFileContainerList from './MobileFileContainerList'

function MobileFileContainer (props) {
    const [file, setFile] = useState(props.files[0] || undefined)
    const names = props.files.map((file) => {
        return { 
            name: file['title'] + `${(file['version'] > 1) ? `(v.${file['version']})` : ''}`, 
            id: file['id']
        }
    })

    async function changeFile(event) {
        const file = await props.files.find(file => file['id'] === event.target.value)
        setFile(file)
    }

    useEffect(() => {
        setFile(props.files[0])
    }, [props.files])

    return (
        <div className='mobileOnly'>
            {props.files ? <MobileFileContainerList names={names} onChangeFile={changeFile}/> : <div>Fetching Files...</div>}
            {file && <MobileFileContainerDetails file={file} setNotesPopUp={props.setNotesPopUp}/>}
        </div>
    )
}

export default MobileFileContainer
