

function FixedListComboBox({ projectList, selected, onChangeProject }) {

    console.log(projectList)
    const options = projectList.map((project) => {
        const name = project['Project Name']
        const status = project['Project Status'].replace(/\s+/g, '')

        return <option 
        className={`proj-status status-${status}`}
        key={name} 
        value={name} 
        {...name===selected && 'selected'}
        >
            {name}
        </option>
    })   

    return (
        <div>
            <label htmlFor="projectSelector">Project:</label>
            <select 
                name="projectSelector" 
                id="projectSelector"
                onChange={onChangeProject}
            >
            {options}
            </select>
        </div>
    )
}

export default FixedListComboBox