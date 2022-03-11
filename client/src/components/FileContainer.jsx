import React, { useEffect, useState } from 'react'
import Button from './Button'


const FileContainer = (props) => {
    const [noFiles, setNoFiles] = useState(props.files[0].title == '(no files found)')
    const noFilesStyle = noFiles ? {} : {display: 'none'}

    const items = props.files.map((file) => {
        file.title = file.title || "(No Title Found)"
        const adjustedFileName = file.title.length > 30 
            ? (file.title.substring(0, 27) + '...') 
            : file.title
        const notes = file.notes || '(No Notes)'
        const longNotes = (notes.length > 30)
        const showReviewBtn = (file.status && file.status === "Awaiting Client Review")
        return (<tr key={file.id} className='relposition'>
            <td ><Button text={adjustedFileName} className={`file-link-btn orange-btn ${file.link && 'btn-has-link'}`} btnLink={file.link}/></td>
            <td>{file.version}</td>
            <td >{file.stage}</td>
            <td >{file.status}</td>
            {/* <td >{file.deadline}</td> */}
            {longNotes 
                ? <td><Button text='View Notes' className='orange-btn notes-btn' onClick={(e) => props.setNotesPopUp({ fileName: file.title, notes: notes })}/></td>
                : <td>{notes}</td>}
            {showReviewBtn && 
                <td className='action-required-column'>
                    <Button text='Update Status' btnLink={file.reviewLink} className='file-review-btn orange-btn' alert={true}/>
                    <p className="note">Due by {file.deadline}!</p>
                </td>}
        </tr>)
    })

    useEffect(() => {
        setNoFiles(props.files[0].title == '(no files found)')
    })

    return (
        <div className='file-container'>
        <table className='file-table'>
            <tbody>
            <tr>
                <th className='blue'>File</th>
                <th className='blue'>Version</th>
                <th className='blue'>Stage</th>
                <th className='blue'>Status</th>
                {/* <th className='blue'>Review Deadline</th> */}
                <th className='blue'>Notes</th>
            </tr>
            {!noFiles && items}
            </tbody>
        </table>
            <span style={noFilesStyle} className='no-files-desktop'>(no files found)</span>
        </div>

    )
}

export default FileContainer
