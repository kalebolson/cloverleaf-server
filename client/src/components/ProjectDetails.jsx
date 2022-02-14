
function ProjectDetails({ project }) { 
    if (project) {
        var status = project['Project Status'] || 'N/A'
        var type = project['Type'] || 'N/A'
        var fileCount = project['File Count'] || 'N/A'
        var dueDate = parseDate(project['Due Date']) || 'N/A'
        var daysLeft = project['Days Until Due'] || ''
        var notes = project['Notes'] || '(No Notes)'
    
        function parseDate(dueDate){
            if (dueDate){
                const list = dueDate.split('-')
                return list[1]+'/'+list[2]+'/'+list[0]
            }
            else{
                return false
            }
        }
    
        return (
            <div className="item-details">
                <div className="flex-column">
                    <div>
                        <h4>Status:</h4> 
                        <p>{status}</p>  
                    </div>
                    <div>
                        <h4>Type:</h4> 
                        <p>{type}</p>
                    </div>
                    <div>
                        <h4>Files:</h4> 
                        <p>{fileCount}</p>
                    </div>
                </div>
                <div className="flex-column column-2">
                    <div>
                        <h4>Due Date:</h4> 
                        <p>{dueDate} <em>{(daysLeft && ` (${daysLeft} days remaining)`)}</em></p>
                    </div>
                    <div className="notesbox">
                        <h4>Notes: </h4>
                        <p>{notes}</p>
                    </div>
                </div>
            </div>
        )
    }   
    else {
        return (
            <div>Fetching Project...</div>
        )
    }
}

export default ProjectDetails