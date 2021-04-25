import React, { useState, useEffect } from "react";
import "./styles.css";
import "./momina.css";
import "./maham.css";
import Logo from "./css/logo.png";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import styled from "styled-components";
import IconButton from '@material/react-icon-button';
import Badge from '@material-ui/core/Badge';
const HomeNavbar = () => {
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
                <Link to="/Catalog">
                <a className="nav-item nav-link">Catalog</a>
                </Link>
                <Link to="/Artisans">
                <a className="nav-item nav-link">Artisans</a>
                </Link>
                <Link to="/AboutUs">
                <a className="nav-item nav-link">About Us</a>
                </Link>
                {/* <Link to="/AddQuery">
                <a className="nav-item nav-link">Contact</a>
                </Link> */}
            </div>
            <div className="navbar-nav ml-auto">
                <Link to="/ShoppingCart">
                <a className="nav-item nav-link"> 
                <Badge badgeContent={numShop} color="secondary">
                <ShoppingCartIcon />
                </Badge>
                {" "}Cart </a>
                </Link>
                <Link to="/Login">
                <a className="nav-item nav-link">Login</a>
                </Link>
                <Link to="/SignupCustomer">
                <a className="nav-item nav-link">Signup</a>
                </Link>
                
            </div>
        </div>
        </nav>
    </div>
    </div>
    )
}

export default HomeNavbar;