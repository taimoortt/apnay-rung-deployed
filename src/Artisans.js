import HomeNavbar from "./HomeNavbar";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";
import SellerNavbar from "./SellerNavbar";
import {useState,useEffect} from 'react';
import Memory from "./Memory";
import Artisan1 from "./css/1.png"
import Artisan2 from "./css/2.png"
import Artisan3 from "./css/3.png"
import Artisan4 from "./css/Artisan4.jpg"
import Artisan5 from "./css/Artisan5.jpg"
import Artisan6 from "./css/Artisan6.jpg"
import Artisan7 from "./css/Artisan8.jpg"
import SpotlightArtisan from "./css/ArtisanSpotlight.jpg"
import BioPopup from './BioPopup';
 import BottomBar from "./BottomBar";
import "./vafa.css";

const Artisans = () => {
    const [viewForm, setViewForm] = useState(false)
    const [sellerState, setSellerState] = useState([]);
    const tokenID = sessionStorage.getItem("Token");
    const usertype = sessionStorage.getItem("TypeOfUser");

    const GetNavbar = () =>{
        if (tokenID === null){
          return (
            <HomeNavbar/>
          )
        }
        else if (usertype === "customer"){
          return(
            <CustomerNavbar/>
          )
        }
        else if (usertype === "admin"){
          return (
            <AdminNavbar/>
          )
        }
        else if (usertype === "seller"){
          return (
            <SellerNavbar/>
          )
        }
    }
    useEffect(() => {
      const getData2 = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk",
            "Content-Type": "application/json"
          }
        });
        return response.json();
      };
   
      getData2("https://apnay-rung-api.herokuapp.com/seller/all").then(
        (response) => {
          setSellerState(response);
          console.log(response)
        }
      );
    }, []);

    const displayTopPictures = () => {
        return(
            <div className="row">
                <div className = "column">
                    <img className = "artisan3-img-top" src= {Artisan1} alt="seller"/>
                </div>
                <div className = "column">
                    <img className = "artisan-img-top" src= {Artisan2} alt="seller"/>
                </div>
                <div className = "column">
                    <img className = "artisan-img-top" src= {Artisan3} alt="seller"/>
                </div>
            </div>
        )
        
    }

    const displaySpotlightArtisan = () => {
        return (
            <div className = "artisan-spotlight-container">
                <span>
                <img className= "artisan-spotlight-img" src= {SpotlightArtisan} alt="seller"/>
                <div className="artisan-spotlight-name">Sahela Bibi</div>
                <div className="artisan-spotlight-description"> <br/>Meet our second time running artisan in the spotlight! <br/><br/>Nine years ago, in a small village of Name Shah Feisal colony, Sahela started her embroidery. Her work journey started out of a dire situation when her husband passed away in a truck accident. With her children still really young, she had to hold the reins to maintain the income of her household. First she learnt the craft firsthand from the women of her village but her determination pushed her to go work in the factory. <br/> We discovered Sahela last year perchance and her products have been a hit since the start. <br /> Please show your support to her cause by buying her products from the Catalog --- all as vibrant as her smile!
                  </div>
                </span>
            </div>
        )
    }

  const handleSetViewForm = () => setViewForm(true)

  const handleBio = (name,location,bio) => {
    const temp = 
    {
      name:name,
      location: location, 
      bio:bio
    }
    sessionStorage.setItem("artisan-content", JSON.stringify(temp));
    handleSetViewForm();

  }

  const CheckBlocked = (blocked, name, location,profile_picture, bio, approved) => {
    console.log(`printing blocked`, blocked)
    if (blocked === false && approved === true){
      return(
      <div className="rest-of-heroes-container">
        <img className="rest-of-heroes-img" src= {profile_picture} alt="seller"/>
        <h3>{name}</h3>
        <h5>{location}</h5>
        <a onClick = {() => handleBio(name, location,bio)} className="read-bio-link">Click to read their story</a>
      </div>
      )
    }
  }

    const renderSellers = () => {
      return sellerState.map((seller, index) => {
        const { seller_id, name, email, phone, location, bio, weeklyartisan, blocked, approved, profile_picture } = seller;
        return (
          <span>
          {
            CheckBlocked(blocked, name, location,profile_picture, bio, approved)
          }
          </span>
        );
      });
    };

    return(
        <div>
        {GetNavbar()}
        <Memory panel="Artisans "/>
        <div className="min-height-div">
        <div className ="artisans-heading">Meet the Artisans</div>
        {displayTopPictures()
        }
        <div className="spotlight-strip-container">
            <div className="spotlight-heading">Artisan in the Spotlight</div>
        </div>
        <br />
                <br />
                <br />
                <br />
        {
             displaySpotlightArtisan()
        }
        <div className="rest-of-heroes-heading">Rest of the Heroes</div>
          {
            renderSellers()
          }
            <BioPopup trigger={viewForm} setTrigger={setViewForm} >
          </BioPopup>
          </div>
          <br/>
          <br/>
          <BottomBar />
        </div>
    );
}; 

export default Artisans; 