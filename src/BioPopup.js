import './vafa.css'
import { Link } from "react-router-dom";


const BioPopup = (props) => {
    const artisan = JSON.parse(sessionStorage.getItem("artisan-content"));

    const handleClose = (e) => {
        console.log(`im here hello`)
        props.setTrigger(false);
    }
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">

                <button className="close-btn" onClick={handleClose}>Close</button>
                <div className="Artisan"> Artisan name: {artisan.name}</div>
                <div className="Location">Location: {artisan.location}</div>
                <div className="Artisan Bio">Bio: {artisan.bio}</div>
                {props.children}
            </div>
        </div>
    ): "";
}

export default BioPopup; 