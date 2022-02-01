import React from 'react'
import Button from './Button'
import alertIcon from '../images/alert.svg'

function MobileFileContainerDetails({ file }) {
    const showReviewBtn = (file.status === "Awaiting Client Review")
    const stage = file.stage || 'N/A'
    const status = file.status || 'N/A'
    const link = file.link || ''
    const reviewLink = file.reviewLink || ''
    const deadline = file.deadline || 'N/A'
    const notes = file.notes || '(No Notes)'
    return (
        <div className='mobile-file-details'>
            <h5>Stage: {stage}</h5>
            <h5>Status: {status}</h5>
            <h5>Notes: {notes}</h5>
            {link && <Button text="Review File" btnLink={link} className='file-btn orange-btn'/>}
            {showReviewBtn && 
                <div className='relposition'>
                    <Button text="Update Status" btnLink={reviewLink} className='file-btn orange-btn' alert={true}/>
                    <p className='note'>Due by {deadline}! </p>
                </div>}

        </div>
    )
}

export default MobileFileContainerDetails
