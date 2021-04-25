import "./styles.css";
import AdminNavbar from "./AdminNavbar";
import CustomerNavbar from "./CustomerNavbar";
import SellerNavbar from "./SellerNavbar";

import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const session = sessionStorage.getItem("logged-in");
  let tokenID = sessionStorage.getItem("Token");
  const usertype = sessionStorage.getItem("TypeOfUser");
  const [numNotif, setNumNotif] = useState(0);

  const [total, setTotal] = useState(0);

  const [state, setState] = useState([
    {
      date: 0,
      time: "",
      notification: ""
    }
  ]);
  const GetNavbar = () =>{
     if (usertype === "customer"){
      return(
        <CustomerNavbar key={callEffect}/>
      )
    }
    else if (usertype === "admin"){
      return (
        <AdminNavbar key={callEffect}/>
      )
    }
    else if (usertype === "seller"){
      return (
        <SellerNavbar key={callEffect}/>
      )
    }
  }
  
  const [callEffect,setCallEffect]= useState(false)
  // const [check, setCheck]= useState(false); //Checks if anything has come from backend
  const checkSession = () => {
    if (session === false || session === null){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }
  useEffect(() => {
    async function getData(url) {
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
    }

    getData("https://apnay-rung-api.herokuapp.com/notification/all").then(
      (response) => {
        console.log(response);    
        setState(response);
        console.log(response)
        console.log(response.length)
        setNumNotif(response.length)
        // GetNavbar()
      }
    );
  }, [callEffect]);


  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState([``]);
  const [action, setAction] = useState(`all`) //decides whether to send request to delete all notifications or just one
  
  const handleShow = (message,type) => {
    setMsg(message)
    if(type===`all`){
      setAction(type)

    }else{
      setAction(`id/${type}`)
    }
    
    setShow(true)
    
  };
  const handleClose = (changeBlock) => {
    setShow(false);
    if(changeBlock===true){
      console.log(`sending to backend, https://apnay-rung-api.herokuapp.com/notification/${action}`)
      sendData()
    }
  };


  async function sendData() {

    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/notification/${action} `,
      {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);

    if (response.status === 200 || response.status === 201 || response.status === 202 ) {
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    }  
  }

  const renderNotifications = () => {
    try{
      if(state.length>0){
        return state.map((item, index) => {
          const { timestamp, title, notification_id } = item; //destructuring
          const date= (timestamp.split(" "))[0]
          const time= (timestamp.split(" "))[1]
          return (
            <div>
              <div className="datetime">
                <h2 className="date remove-wrapping">{date}</h2>
                <h3 className="time">{time}</h3>
              </div>
              <div className="notificationBox">
                <span>
                  {title}
                  <button className="link-v2 deletenotification" onClick={()=>handleShow([`Are you sure you want to delete this notification?`,`Don't Delete`,`Delete Notification`],notification_id)}>
                  Delete
                </button>
                </span>
              </div>
              <br></br>
            </div>
          );
        });
      }
      else{
        return (
          <div className="notificationBox">
            <span>
              You have no new notifications.
            </span>
          </div>
        )
      }
    }
    catch{
    }
  };

  const PanelCheck = () =>{
    if (usertype === "customer"){
      console.log(`type of user`)
      return "Customer Panel "
    } 
    else if (usertype === "seller"){
      console.log(`type of user`)
      return "Seller Panel "
    } 
    else if (usertype === "admin"){
      console.log(`type of user`)
      return "Admin Panel "
    } 
  }

  return (
    <div>
      {checkSession()}
      {GetNavbar()}
      <Memory panel={PanelCheck()} page="" current=" Notifications" />{" "}
      <div className="min-height-div">
      <h1>Notifications</h1>
      <br></br>
      <ul>
        <button className="link-v2 deleteAll" onClick={()=>handleShow([`Are you sure you want to delete all notifications?`,`Don't Delete`,`Delete All`],`all`)}>
        Delete All
        </button>
      </ul>
      <br></br>
      {renderNotifications()}
      <br />
      <br />
      <br />
      <br />
      <br />
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
        <Button
            variant="secondary"
            className="delete-secondary"
            onClick={()=>handleClose(false)}
          >
            {msg[1]}
          </Button>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose(true)}
          >
            {msg[2]}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
