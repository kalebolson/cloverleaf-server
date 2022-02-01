import React, { useEffect, useState } from 'react'
import Button from './Button'


const FileContainer = ({ files }) => {

    const [noFiles, setNoFiles] = useState(files[0].title == '(no files found)')

    const noFilesStyle = noFiles ? {} : {display: 'none'}

    const items = files.map((file) => {
        const showReviewBtn = (file.status && file.status === "Awaiting Client Review")
        return (<tr key={file.title} className='relposition'>
            <td><Button text={file.title} className={`file-link-btn orange-btn ${file.link && 'btn-has-link'}`} btnLink={file.link}/></td>
            <td>{file.stage}</td>
            <td>{file.status}</td>
            <td>{file.deadline}</td>
            <td>{file.notes}</td>
            {showReviewBtn && 
                <td className='action-required-column'>
                    <Button text='Update Status' btnLink={file.reviewLink} className='file-review-btn orange-btn' alert={true}/>
                    <p className="note">Due by {file.deadline}!</p>
                </td>}
        </tr>)
    })

    useEffect(() => {
        setNoFiles(files[0].title == '(no files found)')
    })

    return (
        <div className='file-container'>
        <table className='file-table'>
            <tbody>
            <tr>
                <th>File</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Review Deadline</th>
                <th>Notes</th>
            </tr>
            {!noFiles && items}
            </tbody>
        </table>
            <span style={noFilesStyle} className='no-files-desktop'>(no files found)</span>
        </div>

    )
}

export default FileContainer
