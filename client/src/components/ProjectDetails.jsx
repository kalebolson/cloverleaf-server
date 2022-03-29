
function ProjectDetails({ project, fileCount }) { 
    if (project) {
        var status = project['Project Status'] || 'N/A'
        var type = project['Type'] || 'N/A'
        var fileCount = fileCount || 'N/A'
        var dueDate = parseDate(project['Due Date']) || 'N/A'
        var notes = project['Notes'] || '(No Notes)'
        var daysLeft = (
                (typeof project['Days Until Due'] === "number") 
                || (typeof project['Days Until Due'] === "string")
            ) 
            ?  project['Days Until Due']
            : false
        if (typeof daysLeft === "string"){
            daysLeft = parseInt(daysLeft)
        }
        var daysLeftString = daysLeft >= 0 
            ? ` (${daysLeft} days remaining)`
            : ` (${Math.abs(daysLeft)} days overdue)`
        
    
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
                        <p>{dueDate} <em>{(daysLeft ? daysLeftString : '')}</em></p>
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
            <div>(No Projects Found)</div>
        )
    }
}

export default ProjectDetails