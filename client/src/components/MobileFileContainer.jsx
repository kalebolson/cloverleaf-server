import React from 'react'
import { useState, useEffect } from 'react'
import MobileFileContainerDetails from './MobileFileContainerDetails'
import MobileFileContainerList from './MobileFileContainerList'

function MobileFileContainer ({ files, setNotesPopUp }) {
    const [file, setFile] = useState(files[0] || undefined)

    const names = files.map((file) => file['title'])

    async function changeFile(event) {
        const file = await files.find(file => file['title'] === event.target.value)
        setFile(file)
    }

    useEffect(() => {
        setFile(files[0])
    }, [files])

    return (
        <div className='mobileOnly'>
            {files ? <MobileFileContainerList names={names} onChangeFile={changeFile}/> : <div>Fetching Files...</div>}
            {file && <MobileFileContainerDetails file={file} setNotesPopUp={setNotesPopUp}/>}
        </div>
    )
}

export default MobileFileContainer
