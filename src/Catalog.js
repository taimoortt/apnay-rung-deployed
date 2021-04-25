import "./styles.css";
import "./maham.css";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";
import HomeNavbar from "./HomeNavbar";
import React, { useState, useEffect } from "react";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import { Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

const Catalog = () => {
  const [state, setState] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [callMap, setCallMap] =useState(true);
  const [callEffect, setCallEffect] = useState(false);
  const usertype = sessionStorage.getItem("TypeOfUser");
  const tokenID = sessionStorage.getItem("Token");
  const province = JSON.parse(sessionStorage.getItem("map_province"));
 
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
  const MapProvinces = () =>{
      setCallMap(false);
    if (province !== null && callMap === true) {
        if (province === `Punjab`){
        PunjabProducts();
        
        }
        else if (province === `Sindh`){
        SindhProducts();
        }
        else if(province === `Balochistan`){
            BalochistanProducts();
        }
        else if (province === `KPK`){
            KPKProducts();
        }
        else if (province === `Kashmir`){
            KashmirProducts();
        }
        else if (province === `Gilgit`){
            GilgitProducts();
        }
        else
        {
          console.log("not in map")
          const getData = async (url) => {
            const response = await fetch(url, {
              method: "GET",
              withCredentials: false
            });
            return response.json();
          };
          getData("https://apnay-rung-api.herokuapp.com/inventory/all").then(
            (response) => {
              setState(response);
              console.log(response)
              // console.log("in use effect")
            }
          );
        }
    }
    else
    {
      callAll();
    }
  }

  const sendID = (product) => {
    sessionStorage.removeItem("productID");
    sessionStorage.removeItem("map_province");
    sessionStorage.setItem("productID", JSON.stringify(product));
  };
  const callAll = ()=>{
    const getData = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: false
      });
      return response.json();
    };
    getData("https://apnay-rung-api.herokuapp.com/inventory/all").then(
      (response) => {
        setState(response);
        console.log(response)
        console.log("in call all")
        // console.log("in use effect")
      }
    );

  }

  const renderProducts = () => {
    return state.filter((product,index)=>{
        const { title, seller_name} = product;
        if (searchValue === ""){
            return product
        }
        else if (title.toLowerCase().includes(searchValue.toLowerCase()) || seller_name.toLowerCase().includes(searchValue.toLowerCase())){
            return product
        }
    }).map((product, index) => {
        const { title, seller_name, price, image } = product;//destructuring
      return (
        <Link to="/Product" className="route" onClick={() => sendID(product)}>
          <div className="product-div" id="#product-search">
            <img className="product-img" src={image} alt="product" />
            <h3>{title}</h3>
            <h5>Artist: {seller_name}</h5>
            <h5>Price: Rs {price}</h5>
          </div>
        </Link>
      );
    });
  };
  const SortAlpha = () =>{
    const getData = async (url) => {
        const response = await fetch(url, {
        method: "GET",
        withCredentials: false
        });
        return response.json();
    };
    getData("https://apnay-rung-api.herokuapp.com/inventory/sort/alphabetical").then(
        (response) => {
        setState(response);
        console.log(response)
        }
    );
  }
    const SortPriceAsc = () =>{
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/sort/price/asc").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const PunjabProducts = () =>{
        console.log("in punjab products func")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/Punjab").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const SindhProducts = () =>{
        console.log("in Bsindh products")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/Sindh").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const BalochistanProducts = () =>{
        console.log("in Balochitsn products")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/Balochistan").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const KashmirProducts = () =>{
        console.log("in kashmir products")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/Kashmir").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const KPKProducts = () =>{
        console.log("in kpk products")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/KPK").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const GilgitProducts = () =>{
        console.log("in gilgit products")
        const getData = async (url) => {
            const response = await fetch(url, {
                method: "GET",
                withCredentials: false
            });
            return response.json();
            };
            getData("https://apnay-rung-api.herokuapp.com/inventory/location/Gilgit-Baltistan").then(
            (response) => {
                setState(response);
                console.log(response)
            }
        );
    }
    const checkMap = () =>{
        if (callMap){
            MapProvinces()
        }
    }

  return (
    <div>
      {GetNavbar()}
      {checkMap()}
      <Memory panel="" page="" current="Catalog" />{" "}
      <div className="min-height-div">
      <h1>Catalog</h1>
      <br></br>
      <ul className="sortbar">
        <li className="dropbtn">
          <a onClick={()=>callAll()}>All Products</a>
        </li>
        <li className="dropbtn">
          <a onClick={()=>SortAlpha()}>Sort A-Z</a>
        </li>
        <li className="dropbtn">
          <a onClick={()=>SortPriceAsc()}>Price (Low to High)</a>
        </li>
        <li className="dropdown">
          <li className="dropbtn">Filter by Region
          <div className="dropdown-content" id="mydropdown">
            <a onClick={()=>PunjabProducts()}>Punjab</a>
            <a onClick={()=>SindhProducts()}>Sindh</a>
            <a onClick={()=>BalochistanProducts()}>Balochistan</a>
            <a onClick={()=>KPKProducts()}>KPK</a>
            <a onClick={()=>GilgitProducts()}>Gilgit-Baltistan</a>
            <a onClick={()=>KashmirProducts()}>Kashmir</a>
          </div>
          </li>
        </li>
        
      </ul>
      <div className="search-catalog">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search Products"
            onChange={(event)=>{setSearchValue(event.target.value)}}
          ></input>
        </div>
      </div>
      <br />
      <div className="space"></div>
      <div className="catalog-adjust">{renderProducts()}</div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Catalog;
