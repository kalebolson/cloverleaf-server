import React from 'react'

const FileContainer = ({ files }) => {
    const items = files.map((file) => {
        
    })

    return (
        <table className='file-table'>
            <tr>
                <th>Stage</th>
                <th>Status</th>
                <th>Action Required?</th>
                <th>Deadline</th>
                <th>Link</th>
                <th>Notes</th>
            </tr>
            {items}
        </table>
    )
}

export default FileContainer
