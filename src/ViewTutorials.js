import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import ModalVideo from 'react-modal-video';
import React, {useState, useEffect} from "react";
import ReactPlayer from 'react-player';
import "react-modal-video/scss/modal-video.scss";



const ViewTutorials = () => {
  const session = sessionStorage.getItem("logged-in");
  const [state, setState] = useState([
    {
      tutorial_id: 0,
      title: "",
      content: "",
      description: ""
    }
  ]);

    const [isOpen, setOpen] = useState(false)
    const [videoID, setVideoID] = useState('')
    const [videos, setVideos] = useState([])
    let tokenID = sessionStorage.getItem("Token");

    useEffect(() => {
        const getData = async (url) => {
          const response = await fetch(url, {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization:
              `Bearer ${tokenID}`,
            }
          });
          return response.json();
        };
        getData("https://apnay-rung-api.herokuapp.com/tutorial/all").then(
        (response) => {
          console.log(`printing videos from back`, response)
          setState(response)
        }
      );
      }, []);
    
    const handleVideoPlayer =(videoID) =>{
        setOpen(true); 
        setVideoID(videoID)
    }

    const renderTableData = () => {
      return state.map((tutorial, index) => {
        const { id, title, content,description} = tutorial; //destructuring
  
        return (
              <button className="tutorial-btn" onClick={()=> handleVideoPlayer(content)}>
              <div className="button-heading-tutorial">{title}</div>
              <div className="button-text-tutorial">{description}</div>
            </button>        
        );
      });
    };
    const usertype = sessionStorage.getItem("TypeOfUser");
    const checkSession = () => {
        if (session === false || session === null || usertype==="admin" || usertype==="customer"){
          sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
          window.location.href = '/Homepage';
        }
    }
  
    return(
        <div>
            {checkSession()}
            <SellerNavbar />
            <Memory panel="Tutorials "/>
            <div className="min-height-div">
            <div className="artisans-heading">View Tutorials</div>            
            <div>
            </div>
            <React.Fragment>
            <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId= {videoID} onClose={() => setOpen(false)} />
            </React.Fragment>
            <div className ="tutorial-div">
            {
              renderTableData()
            }
            </div>
            </div>

           <BottomBar /> 
        </div>

    )



}

export default ViewTutorials

