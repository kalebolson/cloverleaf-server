import React from 'react'
import Button from './Button'

function MobileFileContainerDetails({ file }) {
    const stage = file.stage || 'N/A'
    const status = file.status || 'N/A'
    const fileURL = file.url || ''
    const reviewURL = file.reviewURL || ''
    const deadline = file.deadline || 'N/A'
    const notes = file.notes || '(No Notes)'
    return (
        <div className='mobile-file-details'>
            <h5>Stage: {stage}</h5>
            <h5>Status: {status}</h5>
            <h5>Notes: {notes}</h5>
            {fileURL && <Button text="Review File" btnLink={fileURL} className='file-btn'/>}
            {reviewURL && 
                <div>
                    <h5>NEEDS STATUS UPDATE BY {deadline}! </h5>
                    <Button text="Update Status" btnLink={reviewURL} className='file-btn'/>
                </div>}

        </div>
    )
}

export default MobileFileContainerDetails
