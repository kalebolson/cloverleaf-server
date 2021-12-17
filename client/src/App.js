import './App.css';
import { useState, useEffect } from 'react'
import Divider from './components/Divider.jsx'
import Header from './components/Header.jsx'
import FixedListComboBox from './components/FixedListComboBox.jsx'
import Welcome from './components/Welcome'
import ProjectDetails from './components/ProjectDetails'
import FileContainer from './components/FileContainer'

function App() {

  //placeholder data, replace all of this with a call to the back end
  const userID = "matthewgrosso95" //Replace this with a url parameter OR pass from authentication somehow
  const fileplaceholder = [
    { 
      'title': 'song 1',
      'stage': 'mix',
      'status': 'Needs Re-Recording',
      'notes': ''
    },
    { 
      'title': 'song 2',
      'stage': 'mix',
      'status': 'Accepted',
      'notes': 'Thanks!!'
    },
    { 
      'title': 'song 3',
      'stage': 'mastering',
      'status': 'Needs Archiving',
      'notes': ''
    }
  ]

  //Setting States
  const [project, setProject] = useState()
  const [projects, setProjects] = useState(["first project", "new album", "music video"])
  const [clientName, setClientName] = useState()
  const [files, setFiles] = useState(fileplaceholder)


  //Calls/Functions
  function changeProject(event) {
    setProject(event.target.value)
    console.log(project)
  }

  const fetchName = async () => {
    const res = await fetch(`/api/misc/name/${userID}`)
    const data = await res.json()
    return data
  }
  const fetchProjects = async() => {
    const res = await fetch(`api/projects/at/${userID}`)
    const data = await res.json()
    const projNames = data.map(obj => obj['Project Name'])

    return projNames
  }

  // Getting name and projects with useeffect with empty bracket dependencies
  // These will only need to be rendered once, on page load.
  useEffect(() => {
    const getName = async () => {
      const nameFromServer = await fetchName()
      setClientName(nameFromServer)
    }
    const getProjects = async () => {
      const projectsFromServer = await fetchProjects()
      setProjects(projectsFromServer)
    }
    
    getProjects()
    getName()
  }, [])

  return (
    <div className="App">
      <Header />
      <Divider />
      <Welcome clientName={clientName}/>
      <FixedListComboBox projectList={projects} selected={project} onChangeProject={changeProject}/>
      <Divider />
      <ProjectDetails />
      <Divider />
      <FileContainer />
    </div>
  );
}

export default App;
