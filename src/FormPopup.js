import './vafa.css'
import { Link } from "react-router-dom";


const FormPopup = (props) => {
    const form = JSON.parse(sessionStorage.getItem("form-content"));

    const handleClose = (e) => {
        props.setTrigger(false);
    }
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">

                <button className="close-btn" onClick={handleClose}>x</button>
                <div className="form-id"><b>Form ID:</b> {form.formID}</div>
                <div className="customer-id"><b>Customer ID:</b> {form.customerID}</div>
                <div className="form-subject"><b>Subject:</b> {form.subject}</div>
                <div className="form-content"><b>Message: </b>{form.content}</div>
                {props.children}
            </div>
        </div>
    ): "";
}

export default FormPopup; 