import React, { useState, useEffect } from "react";
import "./styles.css";
import "./momina.css";
import "./maham.css";
import Logo from "./css/logo.png";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import styled from "styled-components";
import IconButton from '@material/react-icon-button';
import Badge from '@material-ui/core/Badge';
const CustomerNavbar = () => {
  let tokenID = sessionStorage.getItem("Token");
  const [userstate, setUserState] = useState([]);
  const [numNotif, setNumNotif] = useState(0);
  const [numShop, setNumShop] = useState(0);
  let shopCart = JSON.parse(sessionStorage.getItem("shoppingCart"))

  useEffect(() => {
    const findnumShop = () =>
    {
      shopCart = JSON.parse(sessionStorage.getItem("shoppingCart"))
        if (shopCart !== null){
            console.log(shopCart.length)
            setNumShop(JSON.parse(shopCart.length))
        }
    }
    findnumShop()
    }, []); 
  useEffect(() => {
    const getData = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
            `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        }
      });
      return response.json();
    };
      getData("https://apnay-rung-api.herokuapp.com/customer/info").then(
      (response) => {
        console.log(`customer navbar response: ${response}`)
        setUserState(response);
      }
    );
    }, []);

    useEffect(() => {
      const getNotifications = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization:
              `Bearer ${tokenID}`,
            "Content-Type": "application/json"
          }
        });
        return response.json();
      };
        getNotifications("https://apnay-rung-api.herokuapp.com/notification/all").then(
        (response) => {
          console.log(`customer navbar response notif`)
          console.log(response)
          console.log(response.length)
          setNumNotif(response.length)
        }
      );
      }, []);

    const LogoutClear = () =>{
      sessionStorage.removeItem("Token");
      sessionStorage.clear();
      sessionStorage.clear();
    }

    return (
        <div>
        <div className="bs-example">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
        <Link to="/Homepage">
        <a className="navbar-brand">
        <img src={Logo} height="28" alt="CoolBrand"/>
        </a>
        </Link>
        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav">
                <Link to="/Homepage">
                <a className={`nav-item nav-link`}>Home</a>
                </Link>
                <Link to="/CustomerPanel">
                <a className="nav-item nav-link">Panel</a>
                </Link>
                <Link to="/Catalog">
                <a className="nav-item nav-link">Catalog</a>
                </Link>
                <Link to="/Artisans">
                <a className="nav-item nav-link">Artisans</a>
                </Link>
                <Link to="/AboutUs">
                <a className="nav-item nav-link">About Us</a>
                </Link>
                {/* <a className="nav-item nav-link disabled" tabindex="-1">Artisans</a>
                <a  className="nav-item nav-link disabled" tabindex="-1">About Us</a> */}
                <Link to="/AddQuery">
                <a className="nav-item nav-link">Contact</a>
                </Link>
                
            </div>
            <div className="navbar-nav ml-auto">
                <Link to="/Notifications">
                    <a className="nav-item nav-link">
                    {/* <Badge badgeContent={5} color="">
                    <NotificationsNoneIcon />
                    {/* <span class="badge badge-light">7</span>
                    </Badge> */}
                      {/* <IconButton> */}
                      <Badge badgeContent={numNotif} color="secondary">
                        <NotificationsNoneIcon />
                      </Badge>
                      {/* </IconButton> */}
                    </a>
                </Link>
                <Link to="/ShoppingCart">
                <a className="nav-item nav-link"> 
                <Badge badgeContent={numShop} color="secondary">
                <ShoppingCartIcon />
                </Badge>
                {" "}Cart
                </a>
                </Link>
                <Link to="/Homepage" >
                    <a className="nav-item nav-link" onClick={()=>LogoutClear()}>
                    <ExitToAppIcon className="rotate-180" />Logout
                    </a>
                </Link>
                <Link to="/CustomerPanel" >
                <a className="nav-item nav-link">{userstate.name}</a>
                </Link>
                
            </div>
                
        </div>
        </nav>
    </div>
  </div>
  )
}

export default CustomerNavbar;