import "./styles.css";
// import { useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Modal, Button } from "react-bootstrap";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import RateReviewIcon from "@material-ui/icons/RateReview";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const CustomerPanel = () => {
  let link = ``;
  const session = sessionStorage.getItem("logged-in");
  const storage = JSON.parse(sessionStorage.getItem("shoppingCart"));
  const usertype = sessionStorage.getItem("TypeOfUser");

 
  if (storage !== null) {
    link = "/ShoppingCart";
  } else {
    link = "/CustomerPanel";
  }
  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="admin"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const iconStyles = ()=> {
    return {
      buttoncolor: {
        fill: 'white',
        fontSize: 40
      },
      fillIcon: {
        fill: 'white',
      },
    }
  }
  const classes = makeStyles(iconStyles)();
  return (
    <div>
      {checkSession()}
      <CustomerNavbar currentPage="CustomerPanel" />
      <Memory panel="Customer Panel" /> {/* <page="" current="" /> */}
      <div className="min-height-div">
      <h1>Customer Panel</h1>
      <br></br>
      <br></br>
      <div className="all-boxes">
        <div className="box-left">
          <div className="box-left-left">
            <Link
              to={link}
              className="router-link"
              onClick={() => handleShow()}
            >
              <button className="panel-box">
                <span className="icons">
                  <ShoppingCartIcon
                    className={classes.buttoncolor}
                  />
                </span>
                <span className="text">Shopping Cart</span>
              </button>
            </Link>
          </div>
          <div className="box-left-left">
            <Link to="/AddReview" className="router-link">
              <button className="panel-box">
                <span className="icons">
                  <RateReviewIcon
                     className={classes.buttoncolor}
                  />
                </span>
                <span className="text">Add Review</span>
              </button>
            </Link>
          </div>
          
        </div>
        <div className="box-right">
        <div className="box-right-right">
            <Link to="/CustomerSettings" className="router-link">
              <button href="#cart" className="panel-box">
                <span className="icons">
                  <SettingsIcon
                     className={classes.buttoncolor}
                  />
                </span>
                <span className="text">Account Settings</span>
              </button>
            </Link>
          </div>
          <div className="box-right-right">
            <Link to="/Notifications" className="router-link">
              <button  className="panel-box">
                <span className="icons">
                  <NotificationsNoneIcon
                     className={classes.buttoncolor}
                  />
                </span>
                <span className="text">Notifications</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Empty</Modal.Title>
        </Modal.Header>
        <Modal.Body>Shopping Cart is Empty</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
          >
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CustomerPanel;
