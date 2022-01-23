import Button from "./Button"

const PopUp = (props) => {

    return (
        <div className="app-while-popup">
            <div className="close-btn-grandparent">
            <div className="popup">
                {props.closeIcon && 
                <button className="close-popup-btn" onClick={props.closePopUp}>X</button>}
                {props.content}
            </div>
            </div>
        </div>
    )
}

export default PopUp