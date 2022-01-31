import React from 'react'
import logo from '../images/cloverleaflogo.png'
import Button from './Button.jsx'
import {useState} from 'react'
import MobileNav from './MobileNav'
import PopUp from './PopUp'

const Header = (props) => {

    const [navOpen, setNavOpen] = useState(false)
    const [reportIssuePopup, setReportIssuePopUp] = useState()
    const [issueDescription, setIssueDescription] = useState()
    const [issueCheckboxChecked, setIssueCheckboxChecked] = useState(false)
    const [alert, setAlert] = useState()

    function openNav() {
      console.log("opening nav")
      setNavOpen(!navOpen)
    }
    const links = {
        "bookLink": "https://square.site/appointments/book/5HSTX0GJE5TAN/cloverleaf-audio-visual-saint-paul-mn",
        "contactLink": "https://www.cloverleaf.audio/contact"
    }

    function onSignOut() {
        props.setToken(false)
    }

    function closeAlert() {
        setAlert(false)
    }

    async function submitIssueReport(e){
        e.preventDefault();
        let response = await fetch('/api/mailer', {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({
                token: props.token,
                contactClient: issueCheckboxChecked,
                description: issueDescription
            })
        });

        
        (() => {
            setAlert("Thank you!")
            setTimeout(() => {
                setReportIssuePopUp(false)
                setAlert(false)
            }, 1500)
            setIssueCheckboxChecked(false)
            setIssueDescription('')
        })()

    }

    const issueReportContent = (
        <div className="report-issue-content">
            <form onSubmit={submitIssueReport}>
                <label htmlFor="description">Tell us what went wrong, or suggest an improvement!</label><br />
                <textarea className='issue-desc-box' name="description" cols="30" rows="10" value={issueDescription} onChange={(e) => {setIssueDescription(e.target.value)}}></textarea>
                <label className='issue-report-checkbox' htmlFor="letdevcontact">Allow site developer to contact me via email:</label>
                <input type="checkbox" name='letdevcontact' checked={issueCheckboxChecked} onChange={(e) => {setIssueCheckboxChecked(!issueCheckboxChecked)}}/><br />
                <button className='submit-issue-btn'></button>
            </form>
        </div>
    )

    return (
        <header>
            <div className="header-left">
                <img src={logo} alt="Cloverleaf Audio Logo" className="logo"/>
            </div>
            <div className={`header-right ${ navOpen && 'navOpen'}`}>
                <Button 
                    className="header-btns" 
                    text="CONTACT" 
                    btnLink={links["contactLink"]} 
                />
                <Button 
                    className="header-btns" 
                    text="REPORT AN ISSUE" 
                    onClick={(e) => setReportIssuePopUp(true)}
                />
                {props.token && 
                <Button 
                className="header-btns"
                text="CHANGE PASSWORD"  
                onClick={(e) => {props.setChangePwPopUp(true)}}  
                />}
                {props.token && 
                <Button 
                className="header-btns"
                text="SIGN OUT"   
                onClick={onSignOut} 
                />}
                <MobileNav 
                    className={!navOpen ? "nav-btn" : "close-nav-btn"}
                    icon={!navOpen ? "menu" : "closeMenu"} 
                    onNavClick={openNav}
                    navOpen={navOpen}
                    links = {links}
                    token = {props.token}
                    setToken = {props.setToken}
                    setChangePwPopUp = {props.setChangePwPopUp}
                />
            </div>
            {reportIssuePopup && 
                <PopUp 
                    closeIcon={true}
                    closePopUp={(e) => setReportIssuePopUp(false)}
                    content={issueReportContent}
                 />
            }
            {alert && 
                <PopUp 
                    closeIcon={true}
                    closePopUp={closeAlert}
                    content={<h4>{alert}</h4>}
                />}
        </header>
    )
}

export default Header