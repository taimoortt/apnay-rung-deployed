import "./styles.css";
import "./maham.css";
import HomeNavbar from "./HomeNavbar";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";
import SellerNavbar from "./SellerNavbar";
import BottomBar from "./BottomBar";
import logo from "./css/logo.png";
import home from "./css/home.png";
import wpf from "./css/wpf.png";
import gpp from "./css/gpp.png";
import handshake from "./css/handshake.png";
import pk from "./css/pak-map.svg"
import { Link } from "react-router-dom";
import React, { useState,useEffect } from "react";
import TopHeading from "./css/finaltop.png";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const Homepage = () => {
  const [productState, setProductState] = useState([]);
  const [sellerState, setSellerState] = useState([]);
  const tokenID = sessionStorage.getItem("Token");
  const usertype = sessionStorage.getItem("TypeOfUser");
  let message = JSON.parse(sessionStorage.getItem("msg"));
  const [msg, setMsg] = useState([``]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const displayMessage = () =>{
      console.log("in here", message)
      if (message !== null) {
        console.log("also in here")
        setMsg([message, "OK"]);
        message = null;
        sessionStorage.removeItem("msg")
        handleShow();
      } 
   }
   displayMessage()
  }, []);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  
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
      const getData = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          withCredentials: false
        });
        return response.json();
      };
  
      getData("https://apnay-rung-api.herokuapp.com/inventory/featured").then(
        (response) => {
          setProductState(response);
        }
      );
    }, []);

    useEffect(() => {
      const getData2 = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          withCredentials: false
        });
        return response.json();
      };
   
      getData2("https://apnay-rung-api.herokuapp.com/seller/limit/6").then(
        (response) => {
          setSellerState(response);
        }
      );
    }, []);
  const sendID = (product) => {
    sessionStorage.removeItem("productID");
    sessionStorage.setItem("productID", JSON.stringify(product));
  };
  const renderProducts = () => {
    return productState.map((product, index) => {
      const { title, seller_name, price, image } = product; //destructuring
      return (
        <Link to="/Product" className="route" onClick={() => sendID(product)}>
        <div className="product-div">
          <img className="product-img" src={image} alt="product" />
          <h3>{title}</h3>
          <h5>Artist: {seller_name}</h5>
          <h5>Price: Rs {price}</h5>
        </div>
        </Link>
      );
    });
  };
  const renderSellers = () => {
    return sellerState.map((seller, index) => {
      const { name, location, profile_picture } = seller;
      return (
        <div className="grey-main">
          <Link to="/Artisans">
          <img
            className="main-artist-image"
            src={profile_picture}
            alt="seller"
          />
          </Link>
            <br/>
            <p className="main-text-seller">{name}</p>
            <p className="main-text-seller2">{location}</p>
        </div>
      );
    });
  };
  const addProvince = (province) =>{
    sessionStorage.setItem("map_province", JSON.stringify(province));
  }
  return (
    <div>
      {GetNavbar()}
      <span>
        <img className="logo-main" src={TopHeading} alt="logo" />
      </span>
      <div className="home-main-title">
        <img className="home-background" src={home} alt="home" />
        <div className="home-text">DISCOVER | CONNECT | EMPOWER</div>
      </div>

      <p className="featured-prod">Featured Products </p>
      <div className="itemboxes">{renderProducts()}</div>
      <div className="orange-home-bar">
        <p>
          Bringing together indigenous art of Pakistan straight to your doorstep
        </p>
      </div>
      <p className="featured-prod">Explore Art by Region </p>
      <div className="province-click">Click on a province to discover its art</div>
      <div id="image_map">
        <map name="map_example">
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("Sindh")}>
            <area
              //sindh
              alt="Facebook"
              target="_blank"
              shape="poly"
              coords="350,362, 430,345, 470,485, 360,500"
            ></area>
          </Link>
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("Balochistan")}>
            <area
              //balochistan
              alt="Facebook"
              target="_blank"
              shape="poly"
              coords="165,280, 185,445, 335,440, 350,355, 415,330, 425,225"
            ></area>
          </Link>
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("Punjab")}>
            <area
              //punjab
              alt="Facebook"
              target="_blank"
              shape="poly"
              coords="500,150, 580,205, 490,360, 430,330"
            ></area>
          </Link>
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("KPK")}>
            <area
              //kpk
              target="_blank"
              alt="Wikipedia Social Media Article"
              shape="poly"
              coords="475,65, 540,105, 450,225, 415,200"
            ></area>
          </Link>
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("Gilgit")}>
            <area
              //gilgit
              target="_blank"
              alt="Wikipedia Social Media Article"
              shape="poly"
              coords="560,30, 645,95, 595,120, 515,75"
            ></area>
          </Link>
          <Link to="/Catalog" className="router-link" onClick={()=>addProvince("Kashmir")}>
            <area
              //kashmir
              target="_blank"
              alt="Wikipedia Social Media Article"
              shape="poly"
              coords="565,180, 547,166, 540,121, 556,105, 585,115, 550,120"
            ></area>
          </Link>
        </map>
        <img
          src={pk}
          className="flag-image"
          alt="map example"
          usemap="#map_example"
        />
      </div>
      <br />
      <div className="orange-home-bar">
        <p className ="artist-title">Face of the Art</p>
      </div>
      <div className="main-sellers">{renderSellers()}</div>
      <div className="grey-grey">
        <div className="grey-main">
        <img className="end-main-image" src={handshake} alt="end" />
        <div className="home-text-down">Trustworthy Sellers</div>
        <div className="bottom-text">We care about authenticity and ensure our sellers are verified and trustworthy.</div>
        <div className="space-bottom"></div>
        </div>
        <div className="grey-main">
        <img className="end-main-image" src={wpf} alt="end" />
        <div className="home-text-down">Cooperative Support Team</div>
        <div className="bottom-text">In case you have any query of concern, our team is happy to assist.</div>
        <div className="space-bottom"></div>
        </div>
        <div className="grey-main">
        <img className="end-main-image" src={gpp} alt="end" />
        <div className="home-text-down">High Quality Products</div>
        <div className="bottom-text">Apnay Rung ensures that our customers always receive top quality
        products.</div>
        <div className="space-bottom"></div>
        </div>
        
      </div> 
      {/* <br /> */}
      
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
          >
            <Link to="./Homepage"><a>{msg[1]}</a></Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Homepage;
