import './App.css';
import { useState, useEffect } from 'react'
import Divider from './components/Divider.jsx'
import Header from './components/Header.jsx'
import FixedListComboBox from './components/FixedListComboBox.jsx'
import Welcome from './components/Welcome'
import ProjectDetails from './components/ProjectDetails'
import FileContainer from './components/FileContainer'
import MobileFileContainer from './components/MobileFileContainer'
import PopUp from './components/PopUp';

function Home(props) {

  //Create States
  const [project, setProject] = useState()
  const [projects, setProjects] = useState([])
  const [clientName, setClientName] = useState()
  const [files, setFiles] = useState([{title: '(no files found)'}])
  const [initialRender, setInitialRender] = useState(true)
  
  const [oldPW, setOldPW] = useState()
  const [newPW, setNewPW] = useState()
  const [newPWConf, setNewPWConf] = useState()
  const [alert, setAlert] = useState()


  //Calls/Functions
  async function changeProject(event) {
    const project = await getProjectByName(event.target.value)
    setProject(project)
  }

  async function getProjectByName(name) {
    var project = await projects.find(project => project['Project Name'] === name)
    return project
  }

  function closePopUp() {
    props.setChangePwPopUp(false)
  }
  function closeAlert() {
    setAlert(false)
  }

  const fetchName = async () => {
    const res = await fetch(`/api/misc/name/${props.token}`)
    var name = ''
    try{
      name = await res.json()
    } catch (err) {
      console.log(err)
    }
    return name
  }
  const fetchProjects = async() => {
    const res = await fetch(`api/projects/at/${props.token}`)
    const data = await res.json()
    return data
  }

  const changePwContent = (
      <form onSubmit={postChangePW}>
        <label htmlFor="oldPW">Old Password</label>
        <input type="text" name='oldPW' onChange={(e) => setOldPW(e.target.value)}/>
        <label htmlFor="newPW">New Password</label>
        <input type="text" name='newPW' onChange={(e) => setNewPW(e.target.value)}/>
        <label htmlFor="newPWConf">Confirm New Password</label>
        <input type="text" name='newPWConf' onChange={(e) => setNewPWConf(e.target.value)}/>
        <button className='save-pw-btn' {...(submitReady) ? '' : 'disabled'}>Save</button>
      </form>
    )
  

  function submitReady() {
    return(
      newPW === newPWConf &
      newPW.length > 0 &
      oldPW.length > 0
    )
  }

  async function postChangePW(e) {
    e.preventDefault()
    const response = await fetch('/api/login/changepw', {
      method: "POST",
      headers: {
          'Content-type': "application/json"
      },
      body: JSON.stringify({ userID: props.token, oldPW, newPW })
    })
    if (!response.Error){
      closePopUp()
    } else {
      setAlert(response.Error)
    }
    
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
      setProject(projectsFromServer[0])
    }

    getName()
    getProjects()
  }, [])

  useEffect(() => {
    if (initialRender){
      setInitialRender(false)
      return
    }

    const getFiles = async () => {
      const res = await fetch(`api/files/at/${props.token}/${project['Project Name']}`)
      const data = await res.json()
      console.log(data)
      const files = data.length === 0 ? [{title: '(no files found)'}] : data
      setFiles(files)
    }

    if (project){
      console.log('Current Project:',project)
      getFiles()
    } else {
      console.log('Project not yet defined')
    }

    
  }, [project])

  return (
    <div className="home">
      <Welcome clientName={clientName}/>
      <FixedListComboBox projectList={projects} selected={project ? project['Project Name'] : ''} onChangeProject={changeProject} />
      <Divider />
      <ProjectDetails project={project}/>
      <Divider />
      <FileContainer files={files}/> 
      <MobileFileContainer files={files}/>
      {props.changePwPopUp &&
        <PopUp 
        closeIcon={true}
        closePopUp={closePopUp}
        content={changePwContent}
        />
      }
      {alert && 
      <PopUp 
        closeIcon={true}
        closePopUp={closeAlert}
        content={<h3>{alert}</h3>}
      />}
    </div>
  );
}

export default Home;
