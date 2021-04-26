import Memory from "./Memory";
import BottomBar from "./BottomBar";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";
import HomeNavbar from "./HomeNavbar";
import SellerNavbar from "./SellerNavbar";
import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";
import "./maham.css";
import { Modal, Button } from "react-bootstrap";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Box } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const Counter = (props) => {
  const increment = () => {
    props.qtyFunc(props.qty + 1);
  };
  const decrement = () => {
    if (props.qty !== 1) {
      props.qtyFunc(props.qty - 1);
    }
  };

  return (
    <div class="quantity-box">
      <p id="qty">{props.qty}</p>
      <div class="increment-button">
        <button class="increment-button" onClick={increment}>
          {" "}
          <KeyboardArrowUpIcon
            style={{
              fontSize: "small"
            }}
          />{" "}
        </button>
        <button class="increment-button" onClick={decrement}>
          {" "}
          <KeyboardArrowDownIcon
            style={{
              fontSize: "small"
            }}
          />{" "}
        </button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    color: "#ffffff",
    backgroundColor: "#d67d20",
  }
}));
const StyledRating = withStyles({
  root: {
  },
  iconFilled: {
    color: "#d67d20"
  },
  iconHover: {
    color: "#ff3d47"
  },
})(Rating);
const Product = () => {
  const [qty, setQuantity] = useState(1);
  const classes = useStyles();
  const tokenID = sessionStorage.getItem("Token");
  const usertype = sessionStorage.getItem("TypeOfUser");
  const [addCart, setAddCart] = useState(false);

  const GetNavbar = () =>{
    if (tokenID === null){
      return (
        <HomeNavbar key={addCart}/>
      )
    }
    else if (usertype === "customer"){
      return(
        <CustomerNavbar key={addCart}/>
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

  const product = JSON.parse(sessionStorage.getItem("productID"));
  
  let productData = {
    name: product.title,
    inStock: product.stock,
    rating: product.rating,
    Description: product.description,
    Price: product.price,
    productID: product.item_id
  };
  console.log(`product is ${productData.rating}`);


  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const getReviews = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: false
      });
      return response.json();
    };

    getReviews(
      `https://apnay-rung-api.herokuapp.com/order/review/item/${product.item_id}`
    ).then((response) => {
      console.log(`reviews`);
      let allReviews = [];
      let reviewArray=[];
      try{
        response.map((element,ind)=>{
          console.log(response[ind][2])
          if (allReviews.length === 0) {
            allReviews[0] = {
              rating: response[ind][1],
              review: response[ind][2]
            };
          } else {
            allReviews.push({
              rating:response[ind][1],
              review: response[ind][2]
            });
          }

        })
        }catch{}
      
      setReviews((allReviews));
      
    });

  }, []);

  const sellerid = product.seller_id;
  const [sellerBio, setSellerBio] = useState(``);
  const [sellerName, setSellerName] = useState(``);
  useEffect(() => {
    const getSellerBio = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: false
      });
      return response.json();
    };

    console.log(`seller id ${sellerid}`)
    getSellerBio(
      `https://apnay-rung-api.herokuapp.com/seller/id/${sellerid}`
    ).then((response) => {
      setSellerBio(response.bio);
      setSellerName(response.name)
    });
  }, []);

  let ArtisanData = {
    name: sellerName
  };
  const [value] = React.useState(productData.rating);

  const renderReviews = () => {
    const reviewsofItem = reviews.slice();
    if(reviewsofItem.length!==0){
      return reviewsofItem.map((rev, index) => {
        const { rating, review } = rev; //destructuring
        return (
          <div>
              <b>Anonymous User {index+1}</b>
              <br />
              <Box component="fieldset" mb={3} borderColor="transparent" className="reviewer-rating">
                <StyledRating name="read-only" value={rating} readOnly />
                <br/>
                {review}
              </Box>
            <br />
          </div>
        );
      });
    }
    else
    {
      return(
        <div>
          There are no reviews of this product yet.
        </div>
      )
    }

  };
  const[msg2,setMsg2]= useState([``])
  const [show2, setShow2] = useState(false);
  const[msg,setMsg]= useState([``])
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleShow2 = () => {
    setShow2(true);
  };


  const addToCartHandler = (qty) => {
    if (usertype === `customer` || usertype === null)
    {
      if(productData.inStock>=qty){
        let cart = [];
  
        cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
        console.log(cart);
    
        let newProduct = {
        productID: product.item_id,
        productTitle: product.title,
        quantity: qty,
        price: product.price,
        image: product.image,
        totalQuantity: product.stock,
        sellerID: product.seller_id
      };
    
        if (cart == null) {
          cart = [];
          cart[0] = newProduct;
        } else {
          cart.push(newProduct);
        }
    
        sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
        setAddCart(!addCart);
        setMsg([`Product Added`,`Product has been added to your cart.`])
        handleShow()
      }
      else
      {
        setMsg([`We're sorry!`,`Product is out of stock or the desired quantity is not available.`])
        handleShow()
      }
    }
    else
    {
      setMsg2(["Only Customers can purchase Products","OK"])
      handleShow2()
    }
  };

  // sessionStorage.removeItem("shoppingCart");
  const renderProduct = () => {
    const { productID, name, Price } = productData;
    let InStockArr = [];

    if (productData.inStock >= 1) {
      InStockArr = [<span>&#10003; {`${productData.inStock} in stock`}</span>];
    } else {
      InStockArr = [<span>&#x2613; {`out of stock`}</span>];
    }

    console.log(`IN STOCK ${productData.inStock}`)

    return (
      <div>
        <div className="productpage-div">
          <div className="productpage-image">
            <img className="product-image" src={product.image} alt="Logo" />
          </div>
          <div className="product-details">
            <div className="product-title">{product.title}</div>
            <p className="in-stock">{InStockArr}</p>
            <div className="rating">
              {/* {`${productData.rating}/5.0`} */}
              <Box component="fieldset" mb={3} borderColor="transparent">
                <span>
                  {productData.rating}/5.0
                  {/* <Typography component="legend"></Typography> */}
                  <StyledRating name="read-only" value={value} readOnly />
                </span>
              </Box>
           </div>
            <div className="product-desc">
              <h4>Description</h4>
              <p className="description">{productData.Description}</p>
            </div>
            <div>
              <div className="price-text">Rs.{productData.Price}</div>
              <p className="quantity">per piece</p>
            </div>
            <div className="cart-button-product">
            <Counter
                className="quantity-counter"
                qty={qty}
                qtyFunc={setQuantity}
              />
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<ShoppingCartIcon />}
              onClick={() => addToCartHandler(qty)}
            >
              Add to Cart
            </Button>
            </div>
            <div className="productpage-artisan">
              <h3 className="artisan-title">Artisan</h3>
              <div className="artisan-name">{ArtisanData.name}</div>
              <div className="artisan-bio">{sellerBio}</div>
            </div>
          </div>
        </div>
        <div className="review">
          <div className="reviews-heading">Reviews</div>
          {renderReviews()}
        </div>
      </div>
    );
  };

  return (
    <div>
      {GetNavbar()}
      <Memory panel="Catalog " current={product.title} />
      {renderProduct()}
      <br/>
      <br/>
      <br/>
      <BottomBar />
      <Modal
        show={show}
        onHide={() => handleClose()}
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{msg[0]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[1]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleClose()}
            className="delete-primary"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show2}
        onHide={() => handleClose2()}
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg2[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleClose2()}
            className="delete-primary"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;
