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
                <div className="bio-artisan-name">{artisan.name}</div>
                <div className="bio-artisan-location"> {artisan.location}</div>
                <div className="bio-artisan">{artisan.bio}</div>
                <button className="close-btn" onClick={handleClose}>x</button>
                {props.children}
            </div>
        </div>
    ): "";
}

export default BioPopup; 