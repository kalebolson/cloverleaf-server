

function FixedListComboBox({ projectList, selected, onChangeProject }) {

    const options = projectList.map((project) => 
        <option key={project.toString()} value={project} {...project===selected && 'selected'}>{project}</option>
    )

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