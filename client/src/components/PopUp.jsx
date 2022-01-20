import Button from "./Button"

const PopUp = (props) => {

    return (
        <div className="app-while-popup">
            <div className="popup">
                {props.closeIcon && 
                <button onClick={props.closePopUp}>x</button>}
                {props.content}
            </div>
        </div>
    )
}

export default PopUp