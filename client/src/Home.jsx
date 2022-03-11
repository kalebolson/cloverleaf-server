import './App.css';
import { useState, useEffect } from 'react'
import Divider from './components/Divider.jsx'
import ProjectList from './components/ProjectList.jsx'
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
  
  const [oldPW, setOldPW] = useState('')
  const [newPW, setNewPW] = useState('')
  const [newPWConf, setNewPWConf] = useState('')
  const [alert, setAlert] = useState('')
  const [notesPopUp, setNotesPopUp] = useState({fileName: '', notes: ''})
  


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
  function closeNotesPopUp() {
    setNotesPopUp({fileName: '', notes: ''})
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

  const submitReady = () => {
    return(
    newPW === newPWConf &
    newPW.length > 0 &
    oldPW.length > 0
  )}

  const passwordsDoNotMatch = () => {
    return (
      newPW !== newPWConf &
      newPW.length > 0 &
      newPWConf.length > 0
    )
  }

  const changePwContent = (
      <form onSubmit={postChangePW}>
        <div className="flexcolumn">
          <div className="flexrow">
            <label htmlFor="oldPW">Old Password:<span className='red'>*</span></label>
            <input type="password" name='oldPW' onChange={(e) => setOldPW(e.target.value)}/>
          </div>
          <div className="flexrow">
            <label htmlFor="newPW">New Password:<span className='red'>*</span></label>
            <input type="password" name='newPW' onChange={(e) => setNewPW(e.target.value)}/>
          </div>
          <div className="flexrow">
            <label htmlFor="newPWConf">Confirm New Password:<span className='red'>*</span></label>
            <input type="password" name='newPWConf' onChange={(e) => setNewPWConf(e.target.value)}/>
          </div>
          {passwordsDoNotMatch() ? <span className='red italics' >(New Password Fields Do Not Match)</span> : ''}
          <div className="flexrow">
            <button className='save-pw-btn' disabled={submitReady() ? '' : 'true'}>Save</button>
          </div> 
        </div>
      </form>
    )
  
  async function postChangePW(e) {
    e.preventDefault()
    console.log(props.token)
    const response = await fetch('/api/login/changepw', {
      method: "POST",
      headers: {
          'Content-type': "application/json"
      },
      body: JSON.stringify({ userId: props.token, oldPW, newPW })
    })
    console.log(response.body)
    if (response.status == 200){
      closePopUp()
      setAlert('Password Changed Successfully!')
    } else {
      setAlert('Old Password Incorrect')
    }
    
  }

  // Getting name and projects with useeffect with empty bracket dependencies
  // These will only need to be rendered once, on page load.
  useEffect(() => {
    const getName = async () => {
      const nameFromServer = await fetchName()
      setClientName(nameFromServer.name)
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
      const res = await fetch(`api/files/at/${project['Record ID']}`)
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
      <ProjectList projectList={projects} selected={project ? project['Project Name'] : ''} onChangeProject={changeProject} />
      <ProjectDetails project={project}/>
      <Divider />
      <FileContainer files={files} setNotesPopUp={setNotesPopUp}/> 
      <MobileFileContainer files={files} setNotesPopUp={setNotesPopUp}/>
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
        content={<h4>{alert}</h4>}
      />}
      {notesPopUp.notes && 
      <PopUp 
        closeIcon={true}
        closePopUp={closeNotesPopUp}
        content={
        <div className='notes-popup-content'>
          <h3 className='blue'><span className='italicized'>'{notesPopUp.fileName}'</span> notes:</h3>
          <p className='notes-popup-notes'>{notesPopUp.notes}</p>
        </div>}
      />}
    </div>
  );
}

export default Home;
