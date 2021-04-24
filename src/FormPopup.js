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

                <button className="close-btn" onClick={handleClose}>Close</button>
                <div className="form-id">Form ID: {form.formID}</div>
                <div className="customer-id">Customer ID: {form.customerID}</div>
                <div className="form-subject">Subject: {form.subject}</div>
                <div className="form-content">Message: {form.content}</div>
                {props.children}
            </div>
        </div>
    ): "";
}

export default FormPopup; 