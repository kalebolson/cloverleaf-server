import React from 'react'
import Button from './Button'
import alertIcon from '../images/alert.svg'

function MobileFileContainerDetails({ file, setNotesPopUp }) {
    const showReviewBtn = (file.status === "Awaiting Client Review")
    const stage = file.stage || 'N/A'
    const status = file.status || 'N/A'
    const version = file.version || 'N/A'
    const link = file.link || ''
    const reviewLink = file.reviewLink || ''
    const deadline = file.deadline || 'N/A'
    const notes = file.notes || '(No Notes)'
    const longNotes = (notes.length > 30)
    return (
        <div className='mobile-file-details item-details'>
            <div>
                <h4>Stage:</h4>
                <p>{stage}</p>
            </div>
            <div>
                <h4>Status:</h4>
                <p>{status}</p>
            </div>  
            <div>
                <h4>Version:</h4>
                <p>{version}</p>
            </div>  
            {longNotes
                ? <div className='column-btn'>
                    <Button 
                        text='View Notes' 
                        className='mobile-btn orange-btn notes-btn' 
                        onClick={(e) => setNotesPopUp({ fileName: file.title, notes: notes })}
                    />
                  </div>
                : <div>
                    <h4>Notes:</h4>
                    <p>{notes}</p>
                  </div>
            }
            {link && 
                <div className='column-btn'>
                    <Button 
                        text="Review File" 
                        btnLink={link} 
                        className='mobile-btn orange-btn'
                    />
                </div>
            }
            {showReviewBtn && 
                <div className='relposition column-btn'>
                    <Button text="Update Status" btnLink={reviewLink} className='mobile-btn orange-btn' alert={true}/>
                    <p className='note'>Due by {deadline}! </p>
                </div>}

        </div>
    )
}

export default MobileFileContainerDetails
