import React from 'react'
import Button from './Button'

const FileContainer = ({ files }) => {
    const items = files.map((file) => {
        const showReviewBtn = (file.status === "Awaiting Client Review")
        return (<tr>
            <td><Button text={file.title} className={`file-link-btn ${file.link && 'btn-has-link'}`} btnLink={file.link}/></td>
            <td>{file.stage}</td>
            <td>{file.status}</td>
            <td>{file.deadline}</td>
            <td>{file.notes}</td>
            {showReviewBtn && <td className='action-required-column'>Action Required by {file.deadline}!<Button text='Update Status' btnLink={file.reviewLink} className='file-review-btn'/></td>}
        </tr>)
    })

    return (
        <div className='file-container'>
        <table className='file-table'>
            <tr>
                <th>File</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Review Deadline</th>
                <th>Notes</th>
            </tr>
            {items}
        </table>
        </div>

    )
}

export default FileContainer
