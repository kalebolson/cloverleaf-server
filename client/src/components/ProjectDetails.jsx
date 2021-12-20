
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
            <div class="project-details">
                <h4>Status: {status}</h4>
                <h4>Type: {type}</h4>
                <h4>Files: {fileCount}</h4>
                <h4>Due Date: {dueDate} <em>{(daysLeft && ` (${daysLeft} days remaining)`)}</em></h4>
                <h4>Notes: </h4>
                <br /><p>{notes}</p>
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